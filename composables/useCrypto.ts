import dayjs from "dayjs";
import CryptoJS from "crypto-js";

const SIGN_KEY = "super-secret-sign";
const SECRET_KEY = "mHZ3LVwW8ukKEVvWM1dQi5cyP8pXHFpN"; // 32 chars
const IV = "Avbn58RBm4RzprRw"; // 16 chars

// 🔹 AES Encrypt
export function encrypt(data: any): string {
  const KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const IV_WORD = CryptoJS.enc.Utf8.parse(IV);
  const text = typeof data === "string" ? data : JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(text, KEY, {
    iv: IV_WORD,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // base64 string
}

// 🔹 AES Decrypt
export function decrypt(ciphertext: string): any {
  if (!ciphertext) return "";
  try {
    const KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const IV_WORD = CryptoJS.enc.Utf8.parse(IV);
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY, {
      iv: IV_WORD,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return ciphertext;
  }
}

// 🔹 Make Sign (MD5)
export function makeSign(timestamp: number, encryptedData: string): string {
  return CryptoJS.MD5(`${timestamp}${encryptedData}${SIGN_KEY}`).toString();
}

export function dataEncrypt(data: Record<string, any>) {
  const encryptedData = encrypt(data);
  const timestamp = dayjs().unix();
  const sign = makeSign(timestamp, encryptedData);
  return {
    timestamp,
    data: encryptedData,
    sign,
  };
}
