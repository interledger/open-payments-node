import { type KeyLike } from 'crypto'
import {
  httpbis,
  createSigner,
  Request,
  type SigningKey
} from 'http-message-signatures'

export interface RequestLike extends Request {
  body?: string
}

export interface Signer {
  sign(data: Uint8Array): Uint8Array | Promise<Uint8Array>
}

interface BaseSignOptions {
  request: RequestLike
  keyId: string
}

export interface PrivateKeySignOptions extends BaseSignOptions {
  privateKey: KeyLike
}

export interface SignerSignOptions extends BaseSignOptions {
  signer: Signer
}

export type SignOptions = PrivateKeySignOptions | SignerSignOptions

export interface SignatureHeaders {
  Signature: string
  'Signature-Input': string
}

const createSigningKey = (options: SignOptions): SigningKey => {
  if ('signer' in options) {
    return {
      id: options.keyId,
      alg: 'ed25519',
      sign: async (data: Buffer): Promise<Buffer> =>
        Buffer.from(await options.signer.sign(data))
    }
  }

  return createSigner(options.privateKey, 'ed25519', options.keyId)
}

export const createSignatureHeaders = async (
  options: SignOptions
): Promise<SignatureHeaders> => {
  const { request } = options
  const components = ['@method', '@target-uri']
  if (request.headers['Authorization'] || request.headers['authorization']) {
    components.push('authorization')
  }
  if (request.body) {
    components.push('content-digest', 'content-length', 'content-type')
  }

  const signingKey = createSigningKey(options)

  const { headers } = await httpbis.signMessage(
    {
      key: signingKey,
      name: 'sig1',
      params: ['keyid', 'created'],
      fields: components
    },
    {
      method: request.method,
      url: request.url,
      headers: request.headers
    }
  )

  return {
    Signature: headers['Signature'] as string,
    'Signature-Input': headers['Signature-Input'] as string
  }
}
