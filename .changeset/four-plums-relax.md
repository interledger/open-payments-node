---
'@interledger/open-payments': patch
'@interledger/openapi': patch
'@interledger/http-signature-utils': patch
---

Removed the `uuid` dependency in favor of the global `crypto.randomUUID()` API.
