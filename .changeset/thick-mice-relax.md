---
'@interledger/http-signature-utils': patch
---

Removed the `jose` dependency in favor of the global `crypto.subtle` (Web Crypto) API.
