---
layout: post
title: "Quick setup: browser access to your local agent and desktop in ~15 minutes"
date: 2026-10-15
---

The companion to the [design post](/blog/remote-access-for-your-local-ai-agent/) — the concrete, copy-paste version. Generic placeholders throughout; swap in your own domain and email.

**Prerequisites**

- A domain on Cloudflare (any domain you own).
- The Cloudflare CLI, [`cf`](https://developers.cloudflare.com/cf/), installed: `npm install --global cf`.
- The `cloudflared` tunnel client on the machine you're exposing.
- A local agent web UI bound to a loopback port (here, `127.0.0.1:3000`).

## 1. Log in and find your zone

```bash
cf auth login          # opens a browser, authorize once
cf zones list          # note the domain, e.g. yourdomain.com
```

## 2. Create an outbound-only tunnel and route two hostnames

```bash
# Create the tunnel (remotely configured)
cf tunnels create --name my-mac --config-source cloudflare

# Point the hostnames at the local services
cf tunnels config update <TUNNEL_ID> --body '{
  "config": { "ingress": [
    { "hostname": "agent.yourdomain.com", "service": "http://127.0.0.1:3000" },
    { "hostname": "desk.yourdomain.com",  "service": "http://127.0.0.1:6080" },
    { "service": "http_status:404" }
  ]}
}'

# Create DNS records that route the hostnames through the tunnel
cf dns records create --zone yourdomain.com \
  --body '{"type":"CNAME","name":"agent","content":"<TUNNEL_ID>.cfargotunnel.com","proxied":true}'
cf dns records create --zone yourdomain.com \
  --body '{"type":"CNAME","name":"desk","content":"<TUNNEL_ID>.cfargotunnel.com","proxied":true}'
```

## 3. Put authentication in front of everything

```bash
# Enable Access and its built-in email one-time-code login method
cf zero-trust organization create --body '{"name":"my-org"}'
cf zero-trust identity-providers create --body '{"name":"Email OTP","type":"onetimepin","config":{}}'

# Allow only your email, per hostname
cf zero-trust access applications create --body '{
  "name":"agent", "domain":"agent.yourdomain.com", "type":"self_hosted",
  "session_duration":"24h",
  "policies":[{"name":"allow-me","decision":"allow",
    "include":[{"email":{"email":"you@example.com"}}]}]
}'
# repeat the same call with "desk" and "desk.yourdomain.com"
```

## 4. Run the tunnel client

```bash
# Grab the token once and run (keep this running via your start/stop script)
cf tunnels token get <TUNNEL_ID>
cloudflared tunnel run --token <TOKEN>
```

## 5. Enable the desktop bridge (macOS)

```bash
# System Settings → General → Sharing → Screen Sharing → ON
#   → ⓘ → "VNC viewers may control screen with password" → set a password

git clone https://github.com/novnc/noVNC
pip3 install --user websockify
websockify --web=noVNC 127.0.0.1:6080 127.0.0.1:5900
```

On the Mac, the browser prompt will ask for **Username + Password** — that's the macOS account (e.g. your short name + login password), because macOS offers Apple Remote Desktop auth first.

## 6. Keep it awake

```bash
sudo pmset -a sleep 0 displaysleep 0 disksleep 0
```

And in **Lock Screen** settings, set "Require password after display off" to **Never**, so the desktop stays visible instead of showing a lock screen.

## 7. Test

- `https://agent.yourdomain.com` → email one-time code → your agent.
- `https://desk.yourdomain.com/vnc.html?autoconnect=1&resize=scale` → email code → desktop, scaled to fit your screen.

That's it. Nothing is installed on the devices you connect from, and no inbound ports are open on the laptop.
