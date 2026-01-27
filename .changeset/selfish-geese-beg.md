---
'@interledger/open-payments': minor
---

- Adds support for new subject field on grants
- Adds support for new outgoing payment grant spent amounts (`client.outgoingPayment.getGrantSpentAmounts`)
- Deprecated `isFinalizedGrant` in favor of `isFinalizedGrantWithAccessToken` and `isFinalizedGrantWithSubject`, since grants finalized via `subject` may not include an `access_token`
