import * as assert from 'assert'
import * as crypto from 'crypto'
import * as fs from 'fs'
import { Buffer } from 'buffer'
import {
  loadBase64Key,
  loadKey,
  loadOrGenerateKey,
  generateKey,
  loadKeyAsync,
  generateKeyAsync,
  loadOrGenerateKeyAsync,
  loadBase64KeyAsync
} from './key'

describe('Key methods', (): void => {
  const TMP_DIR = './tmp'

  beforeEach(async (): Promise<void> => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true })
  })

  afterEach(async (): Promise<void> => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true })
  })
  describe('loadOrGenerateKey', (): void => {
    test.each`
      tmpDirExists
      ${false}
      ${true}
    `(
      'generates key and saves file - tmp dir exists: $tmpDirExists',
      async ({ tmpDirExists }): Promise<void> => {
        if (tmpDirExists) {
          fs.mkdirSync(TMP_DIR)
        }
        expect(fs.existsSync(TMP_DIR)).toBe(tmpDirExists)
        const key = loadOrGenerateKey(undefined, { dir: TMP_DIR })
        expect(key).toMatchObject({
          asymmetricKeyType: 'ed25519',
          type: 'private'
        })
        expect(key.export({ format: 'jwk' })).toEqual({
          crv: 'Ed25519',
          kty: 'OKP',
          d: expect.any(String),
          x: expect.any(String)
        })
        const keyfiles = fs.readdirSync(TMP_DIR)
        expect(keyfiles.length).toBe(1)
        expect(fs.readFileSync(`${TMP_DIR}/${keyfiles[0]}`, 'utf8')).toEqual(
          key.export({ format: 'pem', type: 'pkcs8' })
        )
      }
    )

    test('generates new key if parsing error', async (): Promise<void> => {
      const key = loadOrGenerateKey('/some/wrong/file')
      expect(key).toBeInstanceOf(crypto.KeyObject)
      expect(key.export({ format: 'jwk' })).toMatchObject({
        crv: 'Ed25519',
        kty: 'OKP',
        d: expect.any(String),
        x: expect.any(String)
      })
    })

    test('can parse key', async (): Promise<void> => {
      const keypair = crypto.generateKeyPairSync('ed25519')
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(
        keyfile,
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      assert.ok(fs.existsSync(keyfile))
      const fileStats = fs.statSync(keyfile)
      const key = loadOrGenerateKey(keyfile)
      expect(key).toBeInstanceOf(crypto.KeyObject)
      expect(key.export({ format: 'jwk' })).toEqual({
        crv: 'Ed25519',
        kty: 'OKP',
        d: expect.any(String),
        x: expect.any(String)
      })
      expect(key.export({ format: 'pem', type: 'pkcs8' })).toEqual(
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      expect(fs.statSync(keyfile).mtimeMs).toEqual(fileStats.mtimeMs)
      expect(fs.readdirSync(TMP_DIR).length).toEqual(1)
    })
  })

  describe('loadKey', (): void => {
    test('can parse key', async (): Promise<void> => {
      const keypair = crypto.generateKeyPairSync('ed25519')
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(
        keyfile,
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      assert.ok(fs.existsSync(keyfile))
      const fileStats = fs.statSync(keyfile)
      const key = loadKey(keyfile)
      expect(key).toBeInstanceOf(crypto.KeyObject)
      expect(key.export({ format: 'jwk' })).toEqual({
        crv: 'Ed25519',
        kty: 'OKP',
        d: expect.any(String),
        x: expect.any(String)
      })
      expect(key.export({ format: 'pem', type: 'pkcs8' })).toEqual(
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      expect(fs.statSync(keyfile).mtimeMs).toEqual(fileStats.mtimeMs)
      expect(fs.readdirSync(TMP_DIR).length).toEqual(1)
    })

    test('throws if cannot read file', async (): Promise<void> => {
      const fileName = `${TMP_DIR}/private-key.pem`

      expect(() => {
        loadKey(fileName)
      }).toThrow(`Could not load file: ${fileName}`)
    })

    test('throws if invalid file', async (): Promise<void> => {
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(keyfile, 'not a private key')
      assert.ok(fs.existsSync(keyfile))
      expect(() => loadKey(keyfile)).toThrow(
        'File was loaded, but private key was invalid'
      )
    })

    test('throws if wrong curve', async (): Promise<void> => {
      const keypair = crypto.generateKeyPairSync('ed448')
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(
        keyfile,
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      assert.ok(fs.existsSync(keyfile))
      expect(() => loadKey(keyfile)).toThrow(
        'Private key did not have Ed25519 curve'
      )
    })
  })

  describe('generateKey', (): void => {
    test('generates key', (): void => {
      const key = generateKey()
      expect(key).toMatchObject({
        asymmetricKeyType: 'ed25519',
        type: 'private'
      })
      expect(key.export({ format: 'jwk' })).toEqual({
        crv: 'Ed25519',
        kty: 'OKP',
        d: expect.any(String),
        x: expect.any(String)
      })
    })

    test.each`
      tmpDirExists
      ${false}
      ${true}
    `(
      'generates key and saves file - tmp dir exists: $tmpDirExists',
      async ({ tmpDirExists }): Promise<void> => {
        if (tmpDirExists) {
          fs.mkdirSync(TMP_DIR)
        }
        expect(fs.existsSync(TMP_DIR)).toBe(tmpDirExists)
        const key = generateKey({ dir: TMP_DIR })
        expect(key).toMatchObject({
          asymmetricKeyType: 'ed25519',
          type: 'private'
        })
        expect(key.export({ format: 'jwk' })).toEqual({
          crv: 'Ed25519',
          kty: 'OKP',
          d: expect.any(String),
          x: expect.any(String)
        })
        const keyfiles = fs.readdirSync(TMP_DIR)
        expect(keyfiles.length).toBe(1)
        expect(fs.readFileSync(`${TMP_DIR}/${keyfiles[0]}`, 'utf8')).toEqual(
          key.export({ format: 'pem', type: 'pkcs8' })
        )
      }
    )

    test('generates key and saves with provided filename', (): void => {
      const fileName = 'private-key'
      const key = generateKey({ dir: TMP_DIR, fileName })
      expect(key).toMatchObject({
        asymmetricKeyType: 'ed25519',
        type: 'private'
      })
      expect(key.export({ format: 'jwk' })).toEqual({
        crv: 'Ed25519',
        kty: 'OKP',
        d: expect.any(String),
        x: expect.any(String)
      })
      const keyfiles = fs.readdirSync(TMP_DIR)
      expect(keyfiles.length).toBe(1)
      expect(keyfiles[0]).toBe(`${fileName}.pem`)
      expect(fs.readFileSync(`${TMP_DIR}/${keyfiles[0]}`, 'utf8')).toEqual(
        key.export({ format: 'pem', type: 'pkcs8' })
      )
    })
  })

  describe('loadBase64Key', (): void => {
    test('can load base64 encoded key', (): void => {
      const key = loadOrGenerateKey(undefined)
      const loadedKey = loadBase64Key(
        Buffer.from(key.export({ type: 'pkcs8', format: 'pem' })).toString(
          'base64'
        )
      )

      assert.ok(loadedKey)
      expect(loadedKey.export({ format: 'jwk' })).toEqual(
        key.export({ format: 'jwk' })
      )
    })

    test('returns undefined if not Ed25519 key', (): void => {
      const key = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048
      }).privateKey
      const loadedKey = loadBase64Key(
        Buffer.from(key.export({ type: 'pkcs8', format: 'pem' })).toString(
          'base64'
        )
      )
      expect(loadedKey).toBeUndefined()
    })
  })

  // SubtleCrypto equivalents (interledger/open-payments-node#7). Cross-checked
  // against the Node-crypto versions above, not just against themselves -
  // proves the two paths actually produce interoperable key material, not
  // just internally-consistent output.
  describe('generateKeyAsync', (): void => {
    test('generates a usable Ed25519 private key', async (): Promise<void> => {
      const key = await generateKeyAsync()
      expect(key.type).toBe('private')
      expect(key.algorithm).toMatchObject({ name: 'Ed25519' })
      expect(key.extractable).toBe(true)
    })

    test('saved PEM is loadable by the Node-crypto loadKey', async (): Promise<void> => {
      await generateKeyAsync({ dir: TMP_DIR, fileName: 'k' })
      const loaded = loadKey(`${TMP_DIR}/k.pem`)
      expect(loaded.asymmetricKeyType).toBe('ed25519')
    })
  })

  describe('loadKeyAsync', (): void => {
    test('loads a PEM written by the Node-crypto generateKey', async (): Promise<void> => {
      const keypair = crypto.generateKeyPairSync('ed25519')
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(
        keyfile,
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )

      const key = await loadKeyAsync(keyfile)
      expect(key.type).toBe('private')
      expect(key.algorithm).toMatchObject({ name: 'Ed25519' })

      // round-trip through exportKey and compare to the original PEM's DER
      const exported = Buffer.from(
        await crypto.webcrypto.subtle.exportKey('pkcs8', key)
      )
      const originalDer = crypto
        .createPrivateKey(
          keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
        )
        .export({ format: 'der', type: 'pkcs8' })
      expect(exported).toEqual(originalDer)
    })

    test('throws if cannot read file', async (): Promise<void> => {
      const fileName = `${TMP_DIR}/private-key.pem`
      await expect(loadKeyAsync(fileName)).rejects.toThrow(
        `Could not load file: ${fileName}`
      )
    })

    test('throws if invalid file', async (): Promise<void> => {
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(keyfile, 'not a private key')
      await expect(loadKeyAsync(keyfile)).rejects.toThrow(
        'File was loaded, but private key was invalid'
      )
    })

    test('throws if wrong curve', async (): Promise<void> => {
      const keypair = crypto.generateKeyPairSync('ed448')
      const keyfile = `${TMP_DIR}/test-private-key.pem`
      fs.mkdirSync(TMP_DIR)
      fs.writeFileSync(
        keyfile,
        keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
      )
      // ed448 isn't a SubtleCrypto-recognized algorithm name at all, so
      // importKey itself rejects before the explicit curve check runs -
      // still the same observable outcome as loadKey's explicit check.
      await expect(loadKeyAsync(keyfile)).rejects.toThrow(
        'File was loaded, but private key was invalid'
      )
    })
  })

  describe('loadOrGenerateKeyAsync', (): void => {
    test('generates new key if parsing error', async (): Promise<void> => {
      const key = await loadOrGenerateKeyAsync('/some/wrong/file')
      expect(key.type).toBe('private')
      expect(key.algorithm).toMatchObject({ name: 'Ed25519' })
    })

    test('loads existing key by path', async (): Promise<void> => {
      await generateKeyAsync({ dir: TMP_DIR, fileName: 'k' })
      const key = await loadOrGenerateKeyAsync(`${TMP_DIR}/k.pem`)
      expect(key.type).toBe('private')
    })
  })

  describe('loadBase64KeyAsync', (): void => {
    test('can load a base64-encoded PEM produced by the Node-crypto path', async (): Promise<void> => {
      const key = loadOrGenerateKey(undefined)
      const loaded = await loadBase64KeyAsync(
        Buffer.from(key.export({ type: 'pkcs8', format: 'pem' })).toString(
          'base64'
        )
      )
      assert.ok(loaded)
      expect(loaded.algorithm).toMatchObject({ name: 'Ed25519' })
    })

    test('rejects if not an Ed25519 key', async (): Promise<void> => {
      const key = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048
      }).privateKey
      await expect(
        loadBase64KeyAsync(
          Buffer.from(key.export({ type: 'pkcs8', format: 'pem' })).toString(
            'base64'
          )
        )
      ).rejects.toThrow()
    })
  })
})
