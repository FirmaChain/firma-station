import { COMMON_KEY } from '../config';

const keySize = 256;
const iterations = 100;
const saltLength = 128 / 8;
const ivLength = 128 / 8;
const pbkdf2Hash = 'SHA-256' as const;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const getCrypto = (): Crypto => {
	if (!globalThis.crypto?.subtle) throw new Error('Web Crypto API is not available');
	return globalThis.crypto;
};

const getRandomBytes = (length: number): Uint8Array => {
	const bytes = new Uint8Array(length);
	getCrypto().getRandomValues(bytes);
	return bytes;
};

const bytesToHex = (bytes: Uint8Array): string => {
	return Array.from(bytes)
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
};

const hexToBytes = (hex: string): Uint8Array => {
	if (hex.length % 2 !== 0) throw new Error('Invalid hex string');

	const bytes = new Uint8Array(hex.length / 2);
	for (let index = 0; index < bytes.length; index += 1) {
		bytes[index] = Number.parseInt(hex.substring(index * 2, index * 2 + 2), 16);
	}

	return bytes;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});

	return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array => {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}

	return bytes;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

const getAesKey = async (key: Uint8Array, keyUsages: KeyUsage[]): Promise<CryptoKey> => {
	return getCrypto().subtle.importKey('raw', toArrayBuffer(key), { name: 'AES-CBC' }, false, keyUsages);
};

const getPbkdf2Key = async (pass: string, salt: Uint8Array, keyUsages: KeyUsage[]): Promise<CryptoKey> => {
	const baseKey = await getCrypto().subtle.importKey('raw', toArrayBuffer(textEncoder.encode(pass)), 'PBKDF2', false, ['deriveKey']);

	return getCrypto().subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: toArrayBuffer(salt),
			iterations,
			hash: pbkdf2Hash
		},
		baseKey,
		{ name: 'AES-CBC', length: keySize },
		false,
		keyUsages
	);
};

export const encryptData = async (originalMessage: string): Promise<string> => {
	try {
		const key = await getAesKey(textEncoder.encode(COMMON_KEY), ['encrypt']);
		const encrypted = await getCrypto().subtle.encrypt(
			{ name: 'AES-CBC', iv: toArrayBuffer(new Uint8Array(ivLength)) },
			key,
			toArrayBuffer(textEncoder.encode(originalMessage))
		);

		return bytesToBase64(new Uint8Array(encrypted));
	} catch (error) {
		return '';
	}
};

export const encrypt = async (originalMessage: string, pass: string): Promise<string> => {
	try {
		const salt = getRandomBytes(saltLength);
		const iv = getRandomBytes(ivLength);
		const key = await getPbkdf2Key(pass, salt, ['encrypt']);
		const encrypted = await getCrypto().subtle.encrypt(
			{ name: 'AES-CBC', iv: toArrayBuffer(iv) },
			key,
			toArrayBuffer(textEncoder.encode(originalMessage))
		);

		return bytesToHex(salt) + bytesToHex(iv) + bytesToBase64(new Uint8Array(encrypted));
	} catch (error) {
		return '';
	}
};

export const decrypt = async (encryptMessage: string, pass: string): Promise<string> => {
	try {
		const salt = hexToBytes(encryptMessage.substring(0, 32));
		const iv = hexToBytes(encryptMessage.substring(32, 64));
		const encrypted = base64ToBytes(encryptMessage.substring(64));
		const key = await getPbkdf2Key(pass, salt, ['decrypt']);
		const decrypted = await getCrypto().subtle.decrypt({ name: 'AES-CBC', iv: toArrayBuffer(iv) }, key, toArrayBuffer(encrypted));

		return textDecoder.decode(decrypted);
	} catch (error) {
		return '';
	}
};
