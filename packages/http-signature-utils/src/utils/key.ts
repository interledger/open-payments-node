import * as crypto from 'crypto'
import * as fs from 'fs'

/**
 * Loads a EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns The KeyObject of the loaded private key
 *
 */
export function loadKey(keyFilePath: string): crypto.KeyObject {
  let fileBuffer
  try {
    fileBuffer = fs.readFileSync(keyFilePath)
  } catch (error) {
    throw new Error(`Could not load file: ${keyFilePath}`)
  }

  let key
  try {
    key = crypto.createPrivateKey(fileBuffer)
  } catch (error) {
    throw new Error('File was loaded, but private key was invalid')
  }

  if (!isKeyEd25519(key)) {
    throw new Error('Private key did not have Ed25519 curve')
  }

  return key
}

interface GenerateKeyArgs {
  /** The directory where to save the key */
  dir?: string
  /** The fileName of the saved key, without the file extension. `args.dir` must be provided for the fileName to register. */
  fileName?: string
}

/**
 * Generates a EdDSA-Ed25519 private key, and optionally saves it in the given directory.
 *
 * @param args - The arguments used to specify where to optionally save the generated key
 * @returns The KeyObject that was generated
 *
 */
export function generateKey(args?: GenerateKeyArgs): crypto.KeyObject {
  const keypair = crypto.generateKeyPairSync('ed25519')
  if (args && args.dir) {
    if (!fs.existsSync(args.dir)) {
      fs.mkdirSync(args.dir)
    }
    fs.writeFileSync(
      `${args.dir}/${
        args.fileName || `private-key-${new Date().getTime()}`
      }.pem`,
      keypair.privateKey.export({ format: 'pem', type: 'pkcs8' })
    )
  }
  return keypair.privateKey
}

/**
 * Loads a EdDSA-Ed25519 private key. If a path to the key was not provided,
 * or if there were any errors when trying to load the given key, a new key is generated and
 * optionally saved in a file.
 *
 * @param keyFilePath - The file path of the private key.
 * @param generateKeyArgs - The arguments used to specify where to optionally save the generated key
 * @returns The KeyObject of the loaded or generated private key
 *
 */
export function loadOrGenerateKey(
  keyFilePath?: string,
  generateKeyArgs?: GenerateKeyArgs
): crypto.KeyObject {
  if (keyFilePath) {
    try {
      return loadKey(keyFilePath)
    } catch {
      /* Could not load key, generating new one */
    }
  }

  return generateKey(generateKeyArgs)
}

/**
 * Loads a Base64 encoded EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns the KeyObject of the loaded private key, or undefined if the key was not EdDSA-Ed25519
 *
 */
export function loadBase64Key(base64Key: string): crypto.KeyObject | undefined {
  const privateKey = Buffer.from(base64Key, 'base64').toString('utf-8')
  const key = crypto.createPrivateKey(privateKey)
  if (isKeyEd25519(key)) {
    return key
  }
}

function isKeyEd25519(key: crypto.KeyObject): boolean {
  const jwk = key.export({ format: 'jwk' })
  return jwk.crv === 'Ed25519'
}

// --- SubtleCrypto-based equivalents (interledger/open-payments-node#7) ---
//
// These generate/load keys through the standard Web Crypto API
// (`crypto.subtle`, via Node's `node:crypto.webcrypto` or `globalThis.crypto`
// in a browser/edge runtime) instead of Node's `crypto` module, so the key
// material itself is portable outside Node. `loadKeyAsync`/`generateKeyAsync`
// still use `fs` for file I/O (reading/writing a .pem on disk is inherently
// Node-specific regardless of crypto backend) - `loadBase64KeyAsync` doesn't
// touch `fs` at all and works in any runtime with Web Crypto + Buffer/base64.
//
// Added alongside the existing functions above, not replacing them: this
// package's own exports and `@interledger/open-payments`'s client both
// consume the synchronous `KeyObject`-returning versions today, and Web
// Crypto's key/export/import operations are inherently async, so making
// these a drop-in replacement would be a breaking API change. That's a
// separate, bigger decision (see the issue) - this keeps both paths
// available non-breaking in the meantime.
//
// Known limitation, not solved by this: the actual HTTP signing step
// (`signatures.ts` -> `http-message-signatures`'s `createSigner`) still
// requires a Node `KeyLike`/`crypto.sign` call under the hood regardless of
// which key-loading path produced the key - that library has no `CryptoKey`
// support for `ed25519` as of the version this package pins (1.0.6, checked
// directly in its published source). A `CryptoKey` from the functions below
// would need `crypto.KeyObject.from()` (Node-only) before it could be
// handed to `createSignatureHeaders` today.

const subtle = crypto.webcrypto.subtle

/** PKCS8 DER -> PEM text, matching the format `KeyObject.export({format:'pem'})` already produces. */
function derToPem(der: ArrayBuffer): string {
  const base64 = Buffer.from(der).toString('base64')
  const lines = base64.match(/.{1,64}/g) ?? [base64]
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`
}

/**
 * PEM text -> PKCS8 DER, the inverse of the above. Copies into a plain
 * Uint8Array rather than returning the Buffer directly - Buffer's backing
 * ArrayBufferLike (which allows SharedArrayBuffer) doesn't satisfy
 * subtle.importKey's BufferSource param, which requires a real ArrayBuffer.
 */
function pemToDer(pem: string): Uint8Array<ArrayBuffer> {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\s+/g, '')
  const nodeBuffer = Buffer.from(base64, 'base64')
  // Buffer's backing store is typed ArrayBufferLike (allows SharedArrayBuffer),
  // which subtle.importKey's BufferSource param doesn't accept - copy into a
  // fresh, unambiguously-typed ArrayBuffer instead.
  const arrayBuffer = new ArrayBuffer(nodeBuffer.byteLength)
  new Uint8Array(arrayBuffer).set(nodeBuffer)
  return new Uint8Array(arrayBuffer)
}

async function isKeyEd25519Async(key: CryptoKey): Promise<boolean> {
  return key.algorithm.name === 'Ed25519'
}

/**
 * SubtleCrypto equivalent of {@link loadKey}.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns The CryptoKey of the loaded private key
 */
export async function loadKeyAsync(keyFilePath: string): Promise<CryptoKey> {
  let fileBuffer
  try {
    fileBuffer = fs.readFileSync(keyFilePath)
  } catch (error) {
    throw new Error(`Could not load file: ${keyFilePath}`)
  }

  let key: CryptoKey
  try {
    key = await subtle.importKey(
      'pkcs8',
      pemToDer(fileBuffer.toString('utf-8')),
      { name: 'Ed25519' },
      true,
      ['sign']
    )
  } catch (error) {
    throw new Error('File was loaded, but private key was invalid')
  }

  if (!(await isKeyEd25519Async(key))) {
    throw new Error('Private key did not have Ed25519 curve')
  }

  return key
}

/**
 * SubtleCrypto equivalent of {@link generateKey}.
 *
 * @param args - The arguments used to specify where to optionally save the generated key
 * @returns The CryptoKey that was generated
 */
export async function generateKeyAsync(
  args?: GenerateKeyArgs
): Promise<CryptoKey> {
  const keypair = (await subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify'
  ])) as unknown as crypto.webcrypto.CryptoKeyPair

  if (args && args.dir) {
    if (!fs.existsSync(args.dir)) {
      fs.mkdirSync(args.dir)
    }
    const der = await subtle.exportKey('pkcs8', keypair.privateKey)
    fs.writeFileSync(
      `${args.dir}/${
        args.fileName || `private-key-${new Date().getTime()}`
      }.pem`,
      derToPem(der)
    )
  }
  return keypair.privateKey
}

/**
 * SubtleCrypto equivalent of {@link loadOrGenerateKey}.
 *
 * @param keyFilePath - The file path of the private key.
 * @param generateKeyArgs - The arguments used to specify where to optionally save the generated key
 * @returns The CryptoKey of the loaded or generated private key
 */
export async function loadOrGenerateKeyAsync(
  keyFilePath?: string,
  generateKeyArgs?: GenerateKeyArgs
): Promise<CryptoKey> {
  if (keyFilePath) {
    try {
      return await loadKeyAsync(keyFilePath)
    } catch {
      /* Could not load key, generating new one */
    }
  }

  return generateKeyAsync(generateKeyArgs)
}

/**
 * SubtleCrypto equivalent of {@link loadBase64Key}.
 *
 * @param base64Key - Base64-encoded PEM private key.
 * @returns the CryptoKey of the loaded private key, or undefined if the key was not EdDSA-Ed25519
 */
export async function loadBase64KeyAsync(
  base64Key: string
): Promise<CryptoKey | undefined> {
  const pem = Buffer.from(base64Key, 'base64').toString('utf-8')
  const key = await subtle.importKey('pkcs8', pemToDer(pem), { name: 'Ed25519' }, true, ['sign'])
  if (await isKeyEd25519Async(key)) {
    return key
  }
}
