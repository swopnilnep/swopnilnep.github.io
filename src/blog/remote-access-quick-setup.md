---
layout: post
title: "Browser access to a local agent and desktop with Cloudflare Tunnel and Access"
date: 2026-09-01
---

This is the operational companion to [Reaching a localhost AI agent from anywhere](/blog/remote-access-for-your-local-ai-agent/). It covers prerequisites, ordered steps with a verification after each, troubleshooting, and teardown.

Placeholders: `example.com` for your domain, `agent.example.com` and `desk.example.com` for the two hostnames, `you@example.com` for your login email, and `127.0.0.1:3000` for the agent's web UI.

## Prerequisites

- A domain whose DNS is active on Cloudflare.
- `cloudflared` on the laptop (`brew install cloudflared`).
- The Cloudflare CLI, `cf` (`npm install --global cf`; requires Node.js 22.18 or later). It was in beta at the time of writing, so check `--help` if a flag has changed.
- `jq`, for parsing CLI output.
- An agent web UI bound to `127.0.0.1:3000`.
- macOS, for the remote-desktop portion.

**Ordering matters.** Create the access policies before the tunnel connector runs, so there is never a window in which a hostname is routable but unauthenticated.

## 1. Authenticate the CLI

```bash
cf auth login                       # browser-based device authorization
cf zones list --name example.com    # confirm the zone exists and is active
```

## 2. Enable Access and a login method

Creating the Zero Trust organization through the API does not add a login method, so add the one-time-code identity provider explicitly.

```bash
cf zero-trust organization create --body '{"name":"personal"}'
cf zero-trust identity-providers create \
  --body '{"name":"Email OTP","type":"onetimepin","config":{}}'
```

Verify: `cf zero-trust identity-providers list` shows a provider of type `onetimepin`.

## 3. Create an access policy per hostname

```bash
for host in agent desk; do
  cf zero-trust access applications create --body "$(jq -nc --arg d "$host.example.com" '{
    name: $d, domain: $d, type: "self_hosted", session_duration: "24h",
    policies: [{ name: "owner", decision: "allow",
                 include: [{ email: { email: "you@example.com" } }] }]
  }')"
done
```

## 4. Create the tunnel, routes, and DNS records

```bash
TUNNEL_ID=$(cf tunnels create --name laptop --config-source cloudflare | jq -r .id)

cf tunnels config update "$TUNNEL_ID" --body '{
  "config": { "ingress": [
    { "hostname": "agent.example.com", "service": "http://127.0.0.1:3000" },
    { "hostname": "desk.example.com",  "service": "http://127.0.0.1:6080" },
    { "service": "http_status:404" }
  ]}
}'

for host in agent desk; do
  cf dns records create --zone example.com --body "$(jq -nc \
    --arg n "$host" --arg t "$TUNNEL_ID.cfargotunnel.com" \
    '{type: "CNAME", name: $n, content: $t, proxied: true}')"
done
```

Store the connector token in a file readable only by you. Passing it with `--token-file` later keeps it out of process listings and shell history.

```bash
install -d -m 700 ~/.cloudflared
cf tunnels token get "$TUNNEL_ID" | jq -r . > ~/.cloudflared/laptop.token
chmod 600 ~/.cloudflared/laptop.token
```

## 5. Allow the public hostname in the agent

Many local web UIs validate the `Host` and `Origin` headers to block DNS rebinding. If yours does, it will reject `agent.example.com` until you add that hostname to its allow-list. The setting is tool-specific. It is usually an environment variable or a config key. Do not work around it by rewriting the `Host` header at the connector; that breaks same-origin checks for the UI's API calls.

## 6. Enable screen sharing and the browser bridge

In **System Settings → General → Sharing**, turn on **Screen Sharing** and limit **Allow access for** to your account. Screen Sharing listens on port 5900 on every network interface, not only loopback, so it is reachable from your local network. Keep the macOS firewall on, and avoid leaving it enabled on shared or public Wi-Fi.

Then install the browser client and the WebSocket bridge:

```bash
git clone --depth 1 https://github.com/novnc/noVNC ~/remote-access/noVNC
python3 -m pip install --user websockify
```

When you connect, noVNC prompts for a username and password. Those are your macOS account credentials, not a VNC password, because macOS offers Apple Remote Desktop authentication first.

## 7. Add a start/stop script

The agent keeps its own lifecycle. This script manages only the bridge and the tunnel connector. Save it as `remote` somewhere on your `PATH`.

```bash
#!/usr/bin/env bash
# remote: start, stop, and inspect the remote-access stack on demand
set -u
RUN="$HOME/remote-access/run"
mkdir -p "$RUN"

start() {
  nohup websockify --web="$HOME/remote-access/noVNC" 127.0.0.1:6080 127.0.0.1:5900 \
    > "$RUN/novnc.log" 2>&1 &
  echo $! > "$RUN/novnc.pid"

  nohup cloudflared tunnel run --token-file "$HOME/.cloudflared/laptop.token" \
    > "$RUN/tunnel.log" 2>&1 &
  echo $! > "$RUN/tunnel.pid"
}

stop() {
  for f in "$RUN"/*.pid; do
    [ -f "$f" ] || continue
    kill "$(cat "$f")" 2>/dev/null
    rm -f "$f"
  done
}

status() {
  for f in "$RUN"/*.pid; do
    [ -f "$f" ] || continue
    name=$(basename "$f" .pid)
    if kill -0 "$(cat "$f")" 2>/dev/null; then echo "$name: up"; else echo "$name: down"; fi
  done
}

case "${1:-status}" in
  start)  start ;;
  stop)   stop ;;
  status) status ;;
  *)      echo "usage: remote {start|stop|status}" >&2; exit 1 ;;
esac
```

`pip install --user` places `websockify` under `~/Library/Python/<version>/bin`. Add that directory to your `PATH` or use the absolute path in the script.

## 8. Verify

```bash
remote start
cf tunnels list | jq '.[] | {name, status}'                     # expect "healthy"
curl -sI https://agent.example.com | grep -iE '^(HTTP|location)'
# expect: HTTP/2 302 and a location under <team>.cloudflareaccess.com
```

The `302` to the Access login page is the most important check: it shows that unauthenticated requests stop at the edge.

<figure>
  <img src="/img/blog/remote-access-status.png" alt="Terminal output showing the bridge and tunnel connector running." width="1000" height="126" loading="lazy">
  <figcaption>Status output from the script; the tunnel reports healthy before you test the hostnames.</figcaption>
</figure>

Then, in a browser:

- `https://agent.example.com` → email one-time code → the agent UI.
- `https://desk.example.com/vnc.html?autoconnect=1&resize=scale` → email one-time code → the desktop, scaled to the window.

## 9. Run it unattended

Keep the laptop awake and logged in so it keeps serving:

```bash
sudo pmset -a sleep 0 displaysleep 0 disksleep 0
```

Set **Lock Screen → Require password after screen saver begins or display is turned off** to **Never**, so the desktop shows instead of a lock screen. Keep the lid open and the laptop on power; closing the lid puts it to sleep regardless, unless it is in clamshell mode with an external display. Revert with `sudo pmset restoredefaults`.

To make the stack start on boot, install the `remote start` command as a user agent:

```xml
# ~/Library/LaunchAgents/com.example.remote.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.example.remote</string>
    <key>ProgramArguments</key>
    <array><string>/usr/local/bin/remote</string><string>start</string></array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.example.remote.plist
```

Or keep it on demand and run `caffeinate -dimsu` in a login item to block sleep while you leave it up. Either way, remember the trade-off: an always-on, always-unlocked desktop is a bigger target, so leave it unattended only where the machine is physically secure.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "There are no login methods available" | No identity provider configured | Step 2 |
| `Untrusted request` from the agent | Host allow-list in the agent | Step 5 |
| noVNC asks for a username | macOS offers Apple Remote Desktop auth first | Use your macOS account credentials |
| Desktop is too large to read | macOS ignores remote resize requests | `resize=scale`, or lower the display resolution |
| Tunnel shows `inactive` | Connector is not running | `remote status`; check `~/remote-access/run/tunnel.log` |
| Lock screen instead of the desktop | Auto-lock is enabled | Step 9 |

## Teardown

```bash
remote stop

for host in agent desk; do
  id=$(cf dns records list --zone example.com --name "$host.example.com" | jq -r '.[0].id')
  cf dns records delete "$id" --zone example.com
done

cf tunnels delete "$TUNNEL_ID"
rm -f ~/.cloudflared/laptop.token
```

Finally, delete the two Access applications (`cf zero-trust access applications delete <app-id>`), turn off Screen Sharing, and restore your power and lock-screen settings.
