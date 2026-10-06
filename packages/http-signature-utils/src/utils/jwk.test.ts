import { generateKeyPairSync, webcrypto } from 'crypto'
import { generateJwk, generateJwkAsync } from './jwk'

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
  })

  // SubtleCrypto equivalent (interledger/open-payments-node#7)
  describe('generateJwkAsync', (): void => {
    test('properly generates jwk', async (): Promise<void> => {
      expect(await generateJwkAsync({ keyId: 'keyid' })).toEqual({
        alg: 'EdDSA',
        kid: 'keyid',
        kty: 'OKP',
        crv: 'Ed25519',
        x: expect.any(String)
      })
    })

    test('properly generates jwk with a provided CryptoKey', async (): Promise<void> => {
      const { privateKey } = (await webcrypto.subtle.generateKey(
        { name: 'Ed25519' },
        true,
        ['sign', 'verify']
      )) as webcrypto.CryptoKeyPair

      expect(await generateJwkAsync({ keyId: 'keyid', privateKey })).toEqual({
        alg: 'EdDSA',
        kid: 'keyid',
        kty: 'OKP',
        crv: 'Ed25519',
        x: expect.any(String)
      })
    })

    test('matches the x of the Node-crypto generateJwk for the same key material', async (): Promise<void> => {
      // Not the same key object across APIs (Node's KeyObject vs CryptoKey
      // aren't interchangeable without a conversion step), but exporting the
      // *same* underlying Ed25519 private key via each path must agree on
      // which bytes are "x" - this is the actual interop claim worth testing.
      const nodeKeyPair = generateKeyPairSync('ed25519')
      const der = nodeKeyPair.privateKey.export({
        format: 'der',
        type: 'pkcs8'
      })
      const cryptoKey = await webcrypto.subtle.importKey(
        'pkcs8',
        der,
        { name: 'Ed25519' },
        true,
        ['sign']
      )

      const fromNode = generateJwk({
        keyId: 'keyid',
        privateKey: nodeKeyPair.privateKey
      })
      const fromSubtle = await generateJwkAsync({
        keyId: 'keyid',
        privateKey: cryptoKey
      })

      expect(fromSubtle.x).toEqual(fromNode.x)
    })

    test('throws if empty keyId', async (): Promise<void> => {
      await expect(generateJwkAsync({ keyId: '' })).rejects.toThrow(
        'KeyId cannot be empty'
      )
    })

    test('rejects if provided key is not EdDSA-Ed25519', async (): Promise<void> => {
      const { privateKey } = (await webcrypto.subtle.generateKey(
        { name: 'Ed448' },
        true,
        ['sign', 'verify']
      )) as webcrypto.CryptoKeyPair

      await expect(
        generateJwkAsync({ keyId: 'keyid', privateKey })
      ).rejects.toThrow()
    })
  })
})
