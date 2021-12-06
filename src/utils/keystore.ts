import CryptoJS from "crypto-js";

const keySize = 256;
const iterations = 100;

export const encrypt = (originalMessage: string, pass: string): string => {
  try {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    });

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(originalMessage, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return salt.toString() + iv.toString() + encrypted.toString();
  } catch (error) {
    return "";
  }
};

export const decrypt = (encryptMessage: string, pass: string): string => {
  try {
    const salt = CryptoJS.enc.Hex.parse(encryptMessage.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptMessage.substr(32, 32));
    const encrypted = encryptMessage.substring(64);

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  } catch (error) {
    return "";
  }
};
