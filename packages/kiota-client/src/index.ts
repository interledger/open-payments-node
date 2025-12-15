import {
  AuthenticationProvider,
  RequestOption,
  RequestInformation
} from '@microsoft/kiota-abstractions'
import {
  FetchRequestAdapter,
  KiotaClientFactory,
  Middleware,
  MiddlewareFactory
} from '@microsoft/kiota-http-fetchlibrary'
import { createWalletAddressClient } from './wallet-address/walletAddressClient.js'
import { createAuthClient } from './auth/authClient.js'
import { createResourceClient } from './resource/resourceClient.js'

// Sample middleware
export class LogRequestMiddleware implements Middleware {
  next: Middleware | undefined
  public async execute(
    url: string,
    requestInit: RequestInit,
    requestOptions?: Record<string, RequestOption>
  ): Promise<Response> {
    console.log(`Request middleware`, { url, requestInit })
    return this.next?.execute(
      url,
      requestInit,
      requestOptions
    ) as Promise<Response>
  }
}

// Sample GNAP Authentication Provider
class GNAPAuthenticationProvider implements AuthenticationProvider {
  constructor(private privateKey: string, private keyId: string) {}

  async authenticateRequest(
    request: RequestInformation,
    additionalAuthenticationContext?: Record<string, unknown>
  ): Promise<void> {
    if (!request.headers) {
      return
    }

    // Basic example of adding access token from request options
    const accessTokenRequestOption = Object.values(
      request.getRequestOptions()
    )[0]

    if (accessTokenRequestOption) {
      request.headers.add(
        'Authorization',
        `GNAP ${accessTokenRequestOption.getKey()}`
      )
    }

    // Here we would sign the request & add HTTP Message Signature headers
    request.headers.add('Signature', '...')
    request.headers.add('Signature-Input', '...')
    request.headers.add('Content-Digest', '...')
  }
}

export class GNAPTokenOption implements RequestOption {
  constructor(public readonly token: string) {}

  getKey(): string {
    return this.token
  }
}

// Adding middleware to log requests
const handlers = MiddlewareFactory.getDefaultMiddlewares()
handlers.unshift(new LogRequestMiddleware())

// Creating the HTTP client with the middleware
const httpClient = KiotaClientFactory.create(undefined, handlers)

// Create the authentication provider
const authProvider = new GNAPAuthenticationProvider('privateKey', 'keyId') // or new AnonymousAuthenticationProvider()

// Create request adapter
const adapter = new FetchRequestAdapter(
  authProvider,
  undefined,
  undefined,
  httpClient
) // or simply new FetchRequestAdapter(authProvider)

// Create the clients
const walletAddressClient = createWalletAddressClient(adapter)
const resourceClient = createResourceClient(adapter)
const authClient = createAuthClient(adapter)

async function main(): Promise<void> {
  try {
    // Fetching wallet address
    const walletAddress = await walletAddressClient
      .withUrl('https://ilp.interledger-test.dev/client-tutorial')
      .get()

    // All properties are optional
    if (
      !walletAddress ||
      !walletAddress.resourceServer ||
      !walletAddress.authServer
    ) {
      throw new Error('Wallet address not found')
    }

    console.log({ walletAddress })

    // Fetching incoming payment in different ways
    const incomingPaymentId = 'e55695ed-f951-47a0-b67d-1fdd02e21d8e'
    const incomingPaymentUrl = `${walletAddress.resourceServer}/incoming-payments/${incomingPaymentId}`

    const incomingPaymentWithUrl = await resourceClient
      .withUrl(incomingPaymentUrl)
      .incomingPayments.byId('doesnt matter') // byId value is ignored when using withUrl()
      .get()

    console.log({ incomingPaymentWithUrl })

    adapter.baseUrl = walletAddress.resourceServer
    const incomingPaymentWithBaseUrlSet = await resourceClient.incomingPayments
      .byId(incomingPaymentId)
      .get()

    console.log({ incomingPaymentWithBaseUrlSet })

    // Creating incoming payment (doesn't work, just for example)
    const newIncomingPayment = await resourceClient.incomingPayments.post(
      {
        incomingAmount: {
          assetCode: walletAddress.assetCode,
          assetScale: walletAddress.assetScale,
          value: '1000'
        }
      },
      { options: [new GNAPTokenOption('someAccessToken')] }
    )

    // Getting grant (doesn't work, just for example)
    adapter.baseUrl = walletAddress.authServer
    const grant = await authClient.post({
      accessToken: {
        access: [
          {
            type: 'outgoing-payment',
            actions: ['create', 'read'],
            identifier: 'someWalletAddressUrl',
            limits: {
              // For limits, the `debitAmount` and `receiveAmount` are actually mutually exclusive
              debitAmount: {
                assetCode: walletAddress.assetCode,
                assetScale: walletAddress.assetScale,
                value: '1000'
              },
              receiveAmount: {
                assetCode: walletAddress.assetCode,
                assetScale: walletAddress.assetScale,
                value: '2000'
              }
            }
          }
        ]
      },
      client: 'https://ilp.interledger-test.dev/client-tutorial'
    })
  } catch (err) {
    // do nothing, just for demo
  }
}
main()
