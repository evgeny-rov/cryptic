export interface KeyData {
  saltBits: Uint8Array;
  key: CryptoKey;
}

interface Cipher {
  salt: string;
  iv: string;
  ciphertext: string;
}

const encodeText = (text: string) => {
  const enc = new TextEncoder();
  return enc.encode(text);
};

const decodeText = (decrypted: ArrayBuffer) => {
  const dec = new TextDecoder();
  return dec.decode(decrypted);
};

const arrayBufferToHex = (buffer: ArrayBuffer, separator = '') => {
  return new Uint8Array(buffer)
    .reduce<string[]>((a, b) => [...a, b.toString(16).padStart(2, '0')], [])
    .join(separator);
};

const hexToArrayBuffer = (hexEncodedString: string) => {
  const octets = hexEncodedString.match(/[\da-f]{2}/gi);

  if (octets) {
    return new Uint8Array(octets.map((h) => parseInt(h, 16)));
  }

  return new Uint8Array();
};

const getRandomIV = () => window.crypto.getRandomValues(new Uint8Array(12));
const getRandomSalt = () => window.crypto.getRandomValues(new Uint8Array(16));

const deriveKey = async (password: string, saltBits: Uint8Array) => {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encodeText(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBits,
      iterations: 10000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return key;
};

export const createKey = async (password: string, salt?: string): Promise<KeyData> => {
  const saltBits = salt ? hexToArrayBuffer(salt) : getRandomSalt();
  const key = await deriveKey(password, saltBits);

  return { key, saltBits };
};

export const encrypt = async (plaintext: string, keyData: KeyData): Promise<Cipher> => {
  const encoded = encodeText(plaintext);
  const ivBits = getRandomIV();
  const { key, saltBits } = keyData;

  const cipherBits = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBits,
    },
    key,
    encoded
  );

  const salt = arrayBufferToHex(saltBits);
  const iv = arrayBufferToHex(ivBits);
  const ciphertext = arrayBufferToHex(cipherBits);

  return { iv, salt, ciphertext };
};

export const decrypt = async (cipher: Cipher, keyData: KeyData): Promise<string> => {
  const ivBits = hexToArrayBuffer(cipher.iv);
  const { key } = keyData;

  const plaintextBits = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBits,
    },
    key,
    hexToArrayBuffer(cipher.ciphertext)
  );

  return decodeText(plaintextBits);
};
