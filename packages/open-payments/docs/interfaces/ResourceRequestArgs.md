[**@interledger/open-payments**](../README.md)

***

[@interledger/open-payments](../globals.md) / ResourceRequestArgs

# Interface: ResourceRequestArgs

Defined in: [packages/open-payments/src/client/index.ts:82](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L82)

## Extends

- [`UnauthenticatedResourceRequestArgs`](UnauthenticatedResourceRequestArgs.md).`AuthenticatedRequestArgs`

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [packages/open-payments/src/client/index.ts:75](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L75)

The access token required to access the resource.
This token is provided when a grant is created.

#### See

[Open Payments - Grant Request](https://openpayments.dev/apis/auth-server/operations/post-request/)

#### Inherited from

`AuthenticatedRequestArgs.accessToken`

***

### url

> **url**: `string`

Defined in: [packages/open-payments/src/client/index.ts:65](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L65)

The full URL of the requested resource.

For example, if the requested resource is an incoming payment:
```
https://openpayments.dev/incoming-payments/08394f02-7b7b-45e2-b645-51d04e7c330c`
```

#### Inherited from

[`UnauthenticatedResourceRequestArgs`](UnauthenticatedResourceRequestArgs.md).[`url`](UnauthenticatedResourceRequestArgs.md#url)
