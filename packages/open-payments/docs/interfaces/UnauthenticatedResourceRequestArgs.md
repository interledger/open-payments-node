[**@interledger/open-payments**](../README.md)

***

[@interledger/open-payments](../globals.md) / UnauthenticatedResourceRequestArgs

# Interface: UnauthenticatedResourceRequestArgs

Defined in: [packages/open-payments/src/client/index.ts:56](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L56)

## Extended by

- [`GrantOrTokenRequestArgs`](GrantOrTokenRequestArgs.md)
- [`ResourceRequestArgs`](ResourceRequestArgs.md)
- [`CollectionRequestArgs`](CollectionRequestArgs.md)

## Properties

### url

> **url**: `string`

Defined in: [packages/open-payments/src/client/index.ts:65](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L65)

The full URL of the requested resource.

For example, if the requested resource is an incoming payment:
```
https://openpayments.dev/incoming-payments/08394f02-7b7b-45e2-b645-51d04e7c330c`
```
