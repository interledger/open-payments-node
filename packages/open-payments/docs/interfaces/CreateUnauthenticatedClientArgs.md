[**@interledger/open-payments**](../README.md)

***

[@interledger/open-payments](../globals.md) / CreateUnauthenticatedClientArgs

# Interface: CreateUnauthenticatedClientArgs

Defined in: [packages/open-payments/src/client/index.ts:237](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L237)

## Properties

### logger?

> `optional` **logger**: `Logger`

Defined in: [packages/open-payments/src/client/index.ts:241](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L241)

The custom logger instance to use. This defaults to the pino logger.

***

### logLevel?

> `optional` **logLevel**: `LevelWithSilent`

Defined in: [packages/open-payments/src/client/index.ts:243](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L243)

The desired logging level

***

### requestTimeoutMs?

> `optional` **requestTimeoutMs**: `number`

Defined in: [packages/open-payments/src/client/index.ts:239](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L239)

Milliseconds to wait before timing out an HTTP request

***

### useHttp?

> `optional` **useHttp**: `boolean`

Defined in: [packages/open-payments/src/client/index.ts:245](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L245)

If enabled, all requests will use http as protocol. Use in development mode only.

***

### validateResponses?

> `optional` **validateResponses**: `boolean`

Defined in: [packages/open-payments/src/client/index.ts:247](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/index.ts#L247)

Enables or disables response validation against the Open Payments OpenAPI specs. Defaults to true.
