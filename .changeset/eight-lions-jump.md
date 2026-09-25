---
'@interledger/http-signature-utils': major
---

Upgrade `httpbis-digest-headers` to v2. `validateSignatureHeaders` is now async since content-digest verification now uses Web Crypto internally.
