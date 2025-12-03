[**@interledger/open-payments**](../README.md)

***

[@interledger/open-payments](../globals.md) / createAuthenticatedClient

# Function: createAuthenticatedClient()

## Call Signature

> **createAuthenticatedClient**(`args`): `Promise`\<[`AuthenticatedClient`](../interfaces/AuthenticatedClient.md)\>

Defined in: [packages/open-payments/src/client/index.ts:322](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L322)

Creates an Open Payments client that exposes methods to call all of the Open Payments APIs.
Each request requiring authentication will be signed with the given private key.

### Parameters

#### args

[`CreateAuthenticatedClientArgs`](../type-aliases/CreateAuthenticatedClientArgs.md)

### Returns

`Promise`\<[`AuthenticatedClient`](../interfaces/AuthenticatedClient.md)\>

## Call Signature

> **createAuthenticatedClient**(`args`): `Promise`\<[`AuthenticatedClient`](../interfaces/AuthenticatedClient.md)\>

Defined in: [packages/open-payments/src/client/index.ts:332](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L332)

**`Experimental`**

The `authenticatedRequestInterceptor` feature is currently experimental and might be removed
in upcoming versions. Use at your own risk! It offers the capability to add a custom method for
generating HTTP signatures. It is recommended to create the authenticated client with the `privateKey`
and `keyId` arguments. If both `authenticatedRequestInterceptor` and `privateKey`/`keyId` are provided, an error will be thrown.

### Parameters

#### args

[`CreateAuthenticatedClientWithReqInterceptorArgs`](../type-aliases/CreateAuthenticatedClientWithReqInterceptorArgs.md)

### Returns

`Promise`\<[`AuthenticatedClient`](../interfaces/AuthenticatedClient.md)\>

### Throws

OpenPaymentsClientError
