import crypto from 'crypto'

import { generateJwk, JWK } from '../utils/jwk'

export type TestKeys = {
  publicKey: JWK
  privateKey: crypto.KeyObject
}

export function generateTestKeys(): TestKeys {
  const { privateKey } = crypto.generateKeyPairSync('ed25519')

  return {
    publicKey: generateJwk({
      keyId: crypto.randomUUID(),
      privateKey
    }),
    privateKey
  }
}
