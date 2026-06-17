import { decrypt, encrypt } from './keystore';
import { Key, Wallet } from './types';

export const loadKeys = (keyName: string): Key => {
	return JSON.parse(localStorage?.getItem(keyName) ?? '{}');
};

export const storeKeys = (keyName: string, key: Key) => {
	localStorage?.setItem(keyName, JSON.stringify(key));
};

export const clearKeys = () => {
	localStorage?.clear();
};

export const invalidateWallet = (store: string) => {
	const stored = loadKeys(store);
	return Object.keys(stored).length === 0;
};

export const getStoredWallet = async (store: string, password: string): Promise<Wallet> => {
	const stored = loadKeys(store);

	if (!stored) throw new Error('Key does not exist');

	return decryptWallet(stored.wallet, password);
};

export const storeKey = async (store: string, password: string, wallet: Wallet) => {
	const encryptData = await encryptWallet(password, wallet);

	storeKeys(store, encryptData);
};

const decryptWallet = async (wallet: string, password: string): Promise<Wallet> => {
	try {
		const decrypted = await decrypt(wallet, password);
		if (!decrypted) throw new Error('Incorrect password');

		return JSON.parse(decrypted);
	} catch (err) {
		throw new Error('Incorrect password', { cause: err });
	}
};

const encryptWallet = async (password: string, wallet: Wallet): Promise<Key> => {
	const encrypted = await encrypt(JSON.stringify(wallet), password);

	if (!encrypted) throw new Error('Encryption error occurred');

	return {
		address: wallet.address,
		wallet: encrypted
	};
};
