---
'@interledger/http-signature-utils': patch
'@interledger/open-payments': patch
---

Added support for signing requests with a Web Crypto `CryptoKey` as an alternative to a Node `KeyObject`/`Buffer`/PEM string. Existing usage is unaffected.
Use `TextEncoder` instead of Node.js `Buffer`.
