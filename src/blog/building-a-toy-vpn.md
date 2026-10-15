---
layout: post
title: "Building a toy VPN: cipher negotiation, Diffie-Hellman, and HMAC from first principles"
summary: "A small Python client and server that negotiate a cipher, agree on a key with Diffie-Hellman, and exchange encrypted, authenticated messages, and a review of what would break it."
date: 2020-04-20
---

A VPN makes two machines on an untrusted network behave as if they were on a private link: an observer on the path can see that traffic is flowing, but cannot read or modify it. For Luther College's CS-460 (Information Assurance and Security), I built the core of that idea as a small Python client and server. The code is on [GitHub](https://github.com/swopnilnep/vpn).

It is not a VPN you should use. It has no routing or tunnel interface, and the cryptography has real flaws, which I list at the end. But building the handshake by hand is the fastest way I know to understand why production protocols look the way they do.

## The protocol

A session has three phases: agree on a cipher, agree on a key, and exchange messages.

<figure>
  <img src="/img/blog/vpn-handshake.png" alt="Sequence diagram: the client proposes ciphers, the server chooses one, the two sides run a Diffie-Hellman exchange, compute a shared key, and the client sends an encrypted message with an HMAC that the server verifies." width="942" height="848" loading="lazy">
  <figcaption>Figure 1. Cipher negotiation, Diffie-Hellman key exchange, and an authenticated message.</figcaption>
</figure>

### 1. Cipher negotiation

The client sends the algorithms and key sizes it supports. The server intersects that list with its own and picks the strongest common option.

```text
client → ProposedCiphers:AES:[128,192,256],Blowfish:[112,224,448],DES:[56]
server → ChosenCipher:AES,256
```

The selection logic is a set intersection, keeping the largest key size both sides support:

```python
def select_cipher(supported: dict, proposed: dict) -> Tuple[str, int]:
    common_ciphers = set(supported.keys()).intersection(proposed.keys())
    cipher, key_size = None, -1
    for c in common_ciphers:
        size = max({-1} | (set(supported[c]) & set(proposed[c])))
        if size > key_size:
            cipher, key_size = c, size
    if not cipher or key_size == -1:
        raise ValueError("Could not agree on a cipher")
    return cipher, key_size
```

### 2. Diffie-Hellman key exchange

Each side generates a private value and sends `g^x mod p`. Each then raises the other's public value to its own private exponent and arrives at the same shared secret, without that secret ever crossing the wire. I used the `diffiehellman` package, which by default uses the 8192-bit MODP group from RFC 3526 and returns the SHA-256 hex digest of the shared secret.

```text
client → DHMKE:<client public key>
server → DHMKE:<server public key>
```

The cipher key and initialization vector (IV) are then carved out of that digest: the key from the front, the IV from the back.

```python
key = shared_key[:key_size // 8].encode()          # first N characters
iv = shared_key[-ivlen[cipher_name]:].encode()      # last 16 (AES) or 8 characters
```

### 3. Authenticated messages

The client pads each message to the block size, encrypts it in CBC mode, and appends an HMAC-SHA256 over the ciphertext. The server recomputes the HMAC and rejects the message if it differs.

```python
ciphertext = crypto.encrypt(add_padding(message))   # AES-CBC
hashing.update(ciphertext)
send(ciphertext + hashing.hexdigest().encode())      # ciphertext || HMAC
```

Encrypting first and then authenticating the ciphertext is the right construction: it lets the receiver discard a tampered message without decrypting it. The server in this repository doesn't take advantage of that, though; it decrypts first and checks the HMAC second (flaw 6 below).

## What this gets right

- **Encrypt-then-MAC.** The MAC covers the ciphertext rather than the plaintext, which is the construction that, applied correctly, rules out padding-oracle attacks.
- **No secrets on the wire.** The key is derived from Diffie-Hellman rather than shipped or hard-coded.
- **A large, standard group.** The default group is an RFC 3526 prime, not a homemade one.

## What would break it

Re-reading this code years later, these are the issues I would flag in a review, roughly in order of severity.

1. **No authentication of the peers.** Unauthenticated Diffie-Hellman is vulnerable to a man-in-the-middle: an attacker on the path can run one exchange with the client and another with the server, then relay and read everything. Real protocols sign the exchange with a long-term key or certificate (TLS), or bind it to static keys known in advance (WireGuard).
2. **A downgrade attack on negotiation.** The cipher list is sent in plaintext and is never authenticated later. An attacker can strip AES from the proposal and force the weakest common option. The server in the repository only offers 56-bit DES, which is breakable with modest resources. TLS 1.3 prevents downgrades by including a hash of the entire handshake transcript in the final `Finished` messages.
3. **Low-entropy keys.** The key is taken from the *hex string* of the digest, so each byte carries 4 bits of entropy instead of 8. An "AES-256" key built this way contains at most 128 bits of entropy. A key-derivation function such as HKDF should expand the shared secret into raw key bytes instead.
4. **The same key for encryption and MAC.** Both the cipher and the HMAC use the same key. Separate keys, derived from the shared secret with different labels, are standard practice.
5. **Predictable IVs.** The first IV is derived from the shared secret. Every later message continues the CBC chain from the previous ciphertext block, so each message's IV is known before it is encrypted. Predictable IVs were the weakness the BEAST attack exploited in TLS 1.0. CBC needs a fresh, unpredictable IV per message; a modern design would use an AEAD mode such as AES-GCM or ChaCha20-Poly1305 with a per-message nonce.
6. **Decrypt before verify.** The server decrypts a message before checking its HMAC. With an encrypt-then-MAC scheme, the MAC should be verified first, in constant time, and the message dropped before any decryption happens. The comparison here is also an ordinary string `==`, which can leak timing information; `hmac.compare_digest` exists for this.
7. **No replay protection.** Messages carry no sequence number, so a captured message can be re-sent. The rolling HMAC state makes naive replays fail, but only incidentally, and it also means a single dropped message desynchronizes the session.
8. **Ambiguous padding and framing.** Messages are padded with null bytes that are stripped on receipt, so a message that legitimately ends in `\0` is altered. Messages are also framed by single `recv(4096)` calls, which assumes TCP preserves message boundaries; it does not.
9. **An unmaintained crypto library.** `pycrypto` has been abandoned since 2013 and has known vulnerabilities. Its maintained successors are `pycryptodome` and `cryptography`.

## What I took away

Each of the flaws above maps onto a feature that real protocols treat as mandatory: peer authentication, transcript binding, key derivation, key separation, nonces, verify-before-decrypt, sequence numbers, and explicit framing. Building a version without them made it clear why each one exists. A handshake that works is a long way from one that is secure, and most of the engineering lives in the gap.

*Built for Luther College's CS-460, Information Assurance and Security (2019–20). The protocol specification and scaffolding came from the course; the implementation is mine.*
