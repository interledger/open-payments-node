import { generateKeyPairSync } from 'crypto'
import { generateJwk } from './jwk'

const mlDsaSupported = ((): boolean => {
  try {
    generateKeyPairSync('ml-dsa-65')
    return true
  } catch {
    return false
  }
})()

describe('jwk', (): void => {
  describe('generateJwk', (): void => {
    test('properly generates jwk', async (): Promise<void> => {
      expect(generateJwk({ keyId: 'keyid' })).toEqual({
        alg: 'EdDSA',
        kid: 'keyid',
        kty: 'OKP',
        crv: 'Ed25519',
        x: expect.any(String)
      })
    })

    test('properly generates jwk with defined private key', async (): Promise<void> => {
      expect(
        generateJwk({
          keyId: 'keyid',
          privateKey: generateKeyPairSync('ed25519').privateKey
        })
      ).toEqual({
        alg: 'EdDSA',
        kid: 'keyid',
        kty: 'OKP',
        crv: 'Ed25519',
        x: expect.any(String)
      })
    })

    test('throws if empty keyId', async (): Promise<void> => {
      expect(() => generateJwk({ keyId: '' })).toThrow('KeyId cannot be empty')
    })

    test('throws if provided key is not EdDSA-Ed25519', async (): Promise<void> => {
      expect(() =>
        generateJwk({
          keyId: 'keyid',
          privateKey: generateKeyPairSync('ed448').privateKey
        })
      ).toThrow('Key is not EdDSA-Ed25519')
    })

    ;(mlDsaSupported ? test : test.skip)(
      'throws if provided key is a post-quantum ML-DSA key',
      async (): Promise<void> => {
        expect(() =>
          generateJwk({
            keyId: 'keyid',
            privateKey: generateKeyPairSync('ml-dsa-65').privateKey
          })
        ).toThrow('Failed to derive public key')
      }
    )
  })
})
