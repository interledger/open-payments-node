import { createPublicKey, generateKeyPairSync, KeyObject, webcrypto } from 'crypto'

export interface JWK {
  kid: string
  alg: 'EdDSA'
  use?: 'sig'
  kty: 'OKP'
  crv: 'Ed25519'
  x: string
}

export const generateJwk = ({
  privateKey: providedPrivateKey,
  keyId
}: {
  privateKey?: KeyObject
  keyId: string
}): JWK => {
  if (!keyId.trim()) {
    throw new Error('KeyId cannot be empty')
  }

  const privateKey = providedPrivateKey
    ? providedPrivateKey
    : generateKeyPairSync('ed25519').privateKey

  const jwk = createPublicKey(privateKey).export({
    format: 'jwk'
  })
  if (jwk.x === undefined) {
    throw new Error('Failed to derive public key')
  }

  if (jwk.crv !== 'Ed25519' || jwk.kty !== 'OKP' || !jwk.x) {
    throw new Error('Key is not EdDSA-Ed25519')
  }

  return {
    alg: 'EdDSA',
    kid: keyId,
    kty: jwk.kty,
    crv: jwk.crv,
    x: jwk.x
  }
}

/**
 * SubtleCrypto equivalent of {@link generateJwk} (interledger/open-payments-node#7).
 * Added alongside, not replacing - see the note in key.ts for why.
 *
 * Exporting an Ed25519 (OKP) private CryptoKey as JWK already includes the
 * public `x` coordinate next to the private `d` (RFC 8037) - no separate
 * "derive the public key" step exists in SubtleCrypto for this curve, so
 * this just omits `d` from the export, same effective result as
 * `createPublicKey(privateKey).export({format:'jwk'})` above.
 */
export const generateJwkAsync = async ({
  privateKey: providedPrivateKey,
  keyId
}: {
  privateKey?: CryptoKey
  keyId: string
}): Promise<JWK> => {
  if (!keyId.trim()) {
    throw new Error('KeyId cannot be empty')
  }

  const privateKey = providedPrivateKey
    ? providedPrivateKey
    : (
        (await webcrypto.subtle.generateKey({ name: 'Ed25519' }, true, [
          'sign',
          'verify'
        ])) as unknown as webcrypto.CryptoKeyPair
      ).privateKey

  const jwk = await webcrypto.subtle.exportKey('jwk', privateKey)

  if (jwk.x === undefined) {
    throw new Error('Failed to derive public key')
  }

  if (jwk.crv !== 'Ed25519' || jwk.kty !== 'OKP' || !jwk.x) {
    throw new Error('Key is not EdDSA-Ed25519')
  }

  return {
    alg: 'EdDSA',
    kid: keyId,
    kty: jwk.kty,
    crv: jwk.crv,
    x: jwk.x
  }
}
