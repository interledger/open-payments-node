[**@interledger/open-payments**](../README.md)

***

[@interledger/open-payments](../globals.md) / OpenPaymentsClientError

# Class: OpenPaymentsClientError

Defined in: [packages/open-payments/src/client/error.ts:11](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L11)

## Extends

- `Error`

## Constructors

### new OpenPaymentsClientError()

> **new OpenPaymentsClientError**(`message`, `args`): [`OpenPaymentsClientError`](OpenPaymentsClientError.md)

Defined in: [packages/open-payments/src/client/error.ts:20](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L20)

#### Parameters

##### message

`string`

##### args

`ErrorDetails`

#### Returns

[`OpenPaymentsClientError`](OpenPaymentsClientError.md)

#### Overrides

`Error.constructor`

## Properties

### code?

> `optional` **code**: `string`

Defined in: [packages/open-payments/src/client/error.ts:15](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L15)

***

### description

> **description**: `string`

Defined in: [packages/open-payments/src/client/error.ts:12](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L12)

***

### details?

> `optional` **details**: `object`

Defined in: [packages/open-payments/src/client/error.ts:16](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L16)

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### status?

> `optional` **status**: `number`

Defined in: [packages/open-payments/src/client/error.ts:14](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L14)

***

### validationErrors?

> `optional` **validationErrors**: `string`[]

Defined in: [packages/open-payments/src/client/error.ts:13](https://github.com/interledger/open-payments-node/blob/b91823b20551eb54191dc7b8869ee3ac65693c94/packages/open-payments/src/client/error.ts#L13)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:28

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:30

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@20.12.7/node\_modules/@types/node/globals.d.ts:21

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
