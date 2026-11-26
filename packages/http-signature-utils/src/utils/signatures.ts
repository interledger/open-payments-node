import { type KeyLike } from 'crypto'
import {
  httpbis,
  createSigner,
  Request,
  SigningKey
} from 'http-message-signatures'

export interface RequestLike extends Request {
  body?: string
}

export interface SignOptions {
  request: RequestLike
  privateKey: KeyLike | CryptoKey
  keyId: string
}

const createWebCryptoSigner = (
  privateKey: CryptoKey,
  keyId: string
): SigningKey => ({
  id: keyId,
  alg: 'ed25519',
  sign: async (data: Buffer) => {
    const signature = await crypto.subtle.sign(
      { name: 'Ed25519' },
      privateKey,
      new Uint8Array(data)
    )
    // http-message-signatures requires a Buffer here
    return Buffer.from(signature)
  }
})

export interface SignatureHeaders {
  Signature: string
  'Signature-Input': string
}

export const createSignatureHeaders = async ({
  request,
  privateKey,
  keyId
}: SignOptions): Promise<SignatureHeaders> => {
  const components = ['@method', '@target-uri']
  if (request.headers['Authorization'] || request.headers['authorization']) {
    components.push('authorization')
  }
  if (request.body) {
    components.push('content-digest', 'content-length', 'content-type')
  }

  const signingKey =
    privateKey instanceof CryptoKey
      ? createWebCryptoSigner(privateKey, keyId)
      : createSigner(privateKey, 'ed25519', keyId)

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
