import {
  AnonymousAuthenticationProvider,
  RequestOption
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

// Adding middleware:
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
      requestInit as RequestInit,
      requestOptions
    ) as Promise<Response>
  }
}

const handlers = MiddlewareFactory.getDefaultMiddlewares()
handlers.push(new LogRequestMiddleware())

// Creating the HTTP client with the middleware
const httpClient = KiotaClientFactory.create(undefined, handlers)

const authProvider = new AnonymousAuthenticationProvider()
const adapter = new FetchRequestAdapter(
  authProvider,
  undefined,
  undefined,
  httpClient
)

// Create the clients
const walletAddressClient = createWalletAddressClient(adapter)
const resourceClient = createResourceClient(adapter)
const authClient = createAuthClient(adapter)

async function main(): Promise<void> {
  try {
    const walletAddress = await walletAddressClient
      .withUrl('https://ilp.interledger-test.dev/client-tutorial') // setting the "base URL"
      .get()

    // All properties are optional
    if (
      !walletAddress ||
      !walletAddress.resourceServer ||
      !walletAddress.authServer
    ) {
      throw new Error('Wallet address not found')
    }
    console.log(walletAddress)

    const incomingPaymentUrl =
      'https://ilp.interledger-test.dev/f537937b-7016-481b-b655-9f0d1014822c/incoming-payments/e55695ed-f951-47a0-b67d-1fdd02e21d8e'

    //What I would ideally like to do:
    const incomingPayment = await resourceClient
      .withUrl(walletAddress.resourceServer)
      .incomingPayments.byId(parseUUIDFromUrl(incomingPaymentUrl))
      .get()

    // only way to properly get incomingPayment
    const incomingPayment = await resourceClient
      .withUrl(incomingPaymentUrl)
      .incomingPayments.byId('doesnt matter') // byId value is ignored when using withUrl()
      .get()

    console.log(incomingPayment)

    const grant = await authClient.withUrl(walletAddress.authServer).post({
      accessToken: {
        access: [
          {
            type: 'incoming-payment',
            actions: ['create', 'read', 'list', 'complete']
          }
        ]
      },
      client: 'https://ilp.interledger-test.dev/client-tutorial'
    })

    console.log(grant)
  } catch (err) {
    console.error(err)
  }
}

main()
