import { RequestLike } from './signatures'
import { verifyContentDigest } from 'httpbis-digest-headers'
import { JWK } from './jwk'
import { decodeBase64 } from './internal'

export async function validateSignatureHeaders(
  request: RequestLike
): Promise<boolean> {
  const sig = request.headers['signature']
  const sigInput = request.headers['signature-input']

  if (
    !sig ||
    !sigInput ||
    typeof sig !== 'string' ||
    typeof sigInput !== 'string'
  )
    return false

  const sigInputComponents = getSigInputComponents(sigInput)

  return (
    !!sigInputComponents &&
    (await validateSigInputComponents(sigInputComponents, request))
  )
}

export async function validateSignature(
  clientKey: JWK,
  request: RequestLike
): Promise<boolean> {
  const sig = request.headers['signature'] as string
  const sigInput = request.headers['signature-input'] as string
  const challenge = await sigInputToChallenge(sigInput, request)
  if (!challenge) {
    return false
  }

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    clientKey,
    { name: 'Ed25519' },
    false,
    ['verify']
  )
  const data = new TextEncoder().encode(challenge)
  // signature is wrapped as `sig1=:<base64>:` per RFC 9421
  const signature = decodeBase64(sig.replace(/^sig1=:|:$/g, ''))
  return crypto.subtle.verify({ name: 'Ed25519' }, publicKey, signature, data)
}

async function sigInputToChallenge(
  sigInput: string,
  request: RequestLike
): Promise<string | null> {
  const sigInputComponents = getSigInputComponents(sigInput)

  if (
    !sigInputComponents ||
    !(await validateSigInputComponents(sigInputComponents, request))
  )
    return null

  // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-09#section-2.3
  let signatureBase = ''
  for (const component of sigInputComponents) {
    if (component === '@method') {
      signatureBase += `"@method": ${request.method}\n`
    } else if (component === '@target-uri') {
      signatureBase += `"@target-uri": ${request.url}\n`
    } else {
      signatureBase += `"${component}": ${request.headers[component]}\n`
    }
  }

  signatureBase += `"@signature-params": ${(
    request.headers['signature-input'] as string
  )?.replace('sig1=', '')}`
  return signatureBase
}

function getSigInputComponents(sigInput: string): string[] | null {
  // https://datatracker.ietf.org/doc/html/rfc8941#section-4.1.1.1
  const messageComponents = sigInput
    .split('sig1=')[1]
    ?.split(';')[0]
    ?.split(' ')
  return messageComponents
    ? messageComponents.map((component) => component.replace(/[()"]/g, ''))
    : null
}

async function validateSigInputComponents(
  sigInputComponents: string[],
  request: RequestLike
): Promise<boolean> {
  // https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol#section-7.3.1

  for (const component of sigInputComponents) {
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-09#section-2.1
    if (component !== component.toLowerCase()) return false
  }

  const isValidContentDigest =
    !sigInputComponents.includes('content-digest') ||
    (!!request.headers['content-digest'] &&
      !!request.headers['content-length'] &&
      !!request.headers['content-type'] &&
      request.body &&
      Object.keys(request.body).length > 0 &&
      sigInputComponents.includes('content-digest') &&
      (await verifyContentDigest(
        request.body,
        request.headers['content-digest'] as string
      )))

  return !(
    !isValidContentDigest ||
    !sigInputComponents.includes('@method') ||
    !sigInputComponents.includes('@target-uri') ||
    (request.headers['authorization'] &&
      !sigInputComponents.includes('authorization'))
  )
}
