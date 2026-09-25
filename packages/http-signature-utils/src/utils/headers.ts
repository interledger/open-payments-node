import { createContentDigestHeader } from 'httpbis-digest-headers'
import {
  createSignatureHeaders,
  SignatureHeaders,
  SignOptions
} from './signatures'

interface ContentHeaders {
  'Content-Digest': string
  'Content-Length': string
  'Content-Type': string
}

export interface Headers extends SignatureHeaders, Partial<ContentHeaders> {}

const createContentHeaders = async (body: string): Promise<ContentHeaders> => {
  return {
    'Content-Digest': await createContentDigestHeader(
      JSON.stringify(JSON.parse(body)),
      ['SHA-512']
    ),
    'Content-Length': new TextEncoder().encode(body).length.toString(),
    'Content-Type': 'application/json'
  }
}

export const createHeaders = async ({
  request,
  privateKey,
  keyId
}: SignOptions): Promise<Headers> => {
  const contentHeaders =
    request.body && (await createContentHeaders(request.body as string))

  if (contentHeaders) {
    request.headers = { ...request.headers, ...contentHeaders }
  }

  const signatureHeaders = await createSignatureHeaders({
    request,
    privateKey,
    keyId
  })

  return {
    ...contentHeaders,
    ...signatureHeaders
  }
}

const KEY_ID_PREFIX = 'keyid="'

export const getKeyId = (signatureInput: string): string | undefined => {
  const keyIdParam = signatureInput
    .split(';')
    .find((param) => param.startsWith(KEY_ID_PREFIX))
  // Trim prefix and quotes
  return keyIdParam?.slice(KEY_ID_PREFIX.length, -1)
}
