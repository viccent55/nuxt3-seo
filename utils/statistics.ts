import FingerprintJS from "@fingerprintjs/fingerprintjs";

// noble cryptography
import { gcm } from "@noble/ciphers/aes.js";
import { randomBytes as nobleRandomBytes } from "@noble/ciphers/utils.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";

type EmptyObjectType = Record<string, any>;

// ----------------------------------------------------
// Global state
// ----------------------------------------------------
let VISITOR_ID = "";
let REQUEST_ID = "";

let DEVICE_ID = "";
const DEVICE_ID_KEY = "STATISTICS_DEVICE_ID";

let PLATFORM_NAME = "";
let QUERY: Record<string, string> = {};

const STATISTICS_KEY = "STATISTICS_KEY";

let APP_ID = "";
let PRODUCT_ID = "";
let ACTION_TYPE = "click";

const BACKEND_KEY = "33d50673-ad86-4b87-bcf2-b76e7a30c9ef";
let BACKEND_URL = "";

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
const ts = () => Math.floor(Date.now() / 1000);

function getRandomBytes(len: number) {
  const c = (globalThis as any)?.crypto;
  if (c?.getRandomValues) return c.getRandomValues(new Uint8Array(len));
  return nobleRandomBytes(len);
}

function bytesToBase64(bytes: Uint8Array): string {
  const bin = String.fromCharCode(...bytes);
  if (typeof btoa !== "undefined") return btoa(bin);
  // eslint-disable-next-line no-undef
  return Buffer.from(bytes).toString("base64");
}

const deriveKey = (s: string) => sha256(utf8ToBytes(s));
const encryptAesGcm = (plain: string, key: Uint8Array, nonce: Uint8Array) =>
  gcm(key, nonce).encrypt(utf8ToBytes(plain));
const hmacSign = (
  dataB64: string,
  nonceB64: string,
  t: number,
  key: Uint8Array
) =>
  bytesToBase64(hmac(sha256, key, utf8ToBytes(`${dataB64}|${nonceB64}|${t}`)));

function getDeviceId() {
  try {
    const cached = localStorage.getItem(DEVICE_ID_KEY);
    if (cached && cached.length >= 16) return cached;
  } catch {}

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const b = getRandomBytes(32);
  let out = "";
  for (let i = 0; i < 32; i++) out += chars[b[i] % chars.length];

  try {
    localStorage.setItem(DEVICE_ID_KEY, out);
  } catch {}
  return out;
}

function getPlatform() {
  if (typeof navigator === "undefined") return "web";
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  const plat = navigator.platform || "";
  const touch = (navigator as any).maxTouchPoints || 0;
  if (plat === "MacIntel" && touch > 1) return "ios";
  return "web";
}

function getQueryParams() {
  if (typeof window === "undefined") return {};
  const usp = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  usp.forEach((v, k) => {
    const decoded = v ? v.replace(/\+/g, " ") : "";
    if (k === "e") setProductId(decoded);
    params[k] = decoded;
  });
  return params;
}

async function getLocal(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return "";
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return "";
  }
}

async function setLocal(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// setters (same names)
// ----------------------------------------------------
function setAppId(appId: string) {
  if (!appId) return;
  APP_ID = appId;
  return appId;
}
function setProductId(productId: string) {
  if (!productId) return;
  PRODUCT_ID = productId;
  return productId;
}
function setActionType(actionType: string) {
  if (!actionType) return;
  ACTION_TYPE = actionType;
  return actionType;
}
function setBackendURL(str: string) {
  if (!str) return;
  BACKEND_URL = str;
  return str;
}

// ----------------------------------------------------
// Fingerprint / visitor (same name)
// ----------------------------------------------------
export async function getVisitorId() {
  try {
    const fp = await FingerprintJS.load();
    const r = await fp.get();
    VISITOR_ID = r.visitorId;
    REQUEST_ID = (r as any)?.requestId || "";
    return { visitorId: VISITOR_ID, requestId: REQUEST_ID };
  } catch (e) {
    console.error("获取VisitorId失败:", e);
    return "";
  }
}

// ----------------------------------------------------
// POST helper (web fetch)
// ----------------------------------------------------
async function post(url: string, data: any, options: EmptyObjectType = {}) {
  const timeout = options?.timeout || 5000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

// ----------------------------------------------------
// Core statistics request
// ----------------------------------------------------
async function onStatistics(info: EmptyObjectType) {
  try {
    if (typeof window === "undefined") return;

    const timestamp = ts();
    const nonceBytes = getRandomBytes(12);
    const nonceBase64 = bytesToBase64(nonceBytes);

    const tempData = JSON.stringify({
      actionType: info?.actionType,
      promoCode: info?.promoCode,
      channelCode: info?.channelCode,
      productCode: info?.productCode,
      timestamp,
    });

    const keyBytes = deriveKey(BACKEND_KEY);
    const dataBase64 = bytesToBase64(
      encryptAesGcm(tempData, keyBytes, nonceBytes)
    );
    const signatureBase64 = hmacSign(
      dataBase64,
      nonceBase64,
      timestamp,
      keyBytes
    );

    const body = {
      data: dataBase64,
      nonce: nonceBase64,
      timestamp,
      signature: signatureBase64,
    };
    const headers = {
      "X-Device-Id": DEVICE_ID,
      "X-App-Id": APP_ID,
      "X-Platform": PLATFORM_NAME,
      "X-VisitorID": VISITOR_ID,
      "X-FP-RequestID": REQUEST_ID,
      "X-Nonce": nonceBase64,
      "X-Timestamp": String(timestamp),
      "X-Signature": signatureBase64,
    };

    return await post(`${BACKEND_URL}/track/action`, body, { headers });
  } catch (e) {
    console.log("统计失败", e);
  }
}

// ----------------------------------------------------
// Local save
// ----------------------------------------------------
async function onSaveLocal() {
  const localData = await getLocal(STATISTICS_KEY);
  if (localData) return;

  await setLocal(STATISTICS_KEY, {
    code: QUERY?.code,
    chan: QUERY?.chan,
    product_id: PRODUCT_ID,
    appId: APP_ID,
    device_id: DEVICE_ID,
    visitor_id: VISITOR_ID,
    create_time: ts(),
    platform: PLATFORM_NAME,
  });
}

// ----------------------------------------------------
// Public handlers (same names)
// ----------------------------------------------------
async function onHandle() {
  return await onStatistics({
    promoCode: QUERY?.code,
    channelCode: QUERY?.chan,
    productCode: PRODUCT_ID,
    actionType: ACTION_TYPE,
    appId: APP_ID,
    deviceId: DEVICE_ID,
    platform: PLATFORM_NAME,
  });
}

// 初始化（only call on client) - same name
export async function onInit() {
  if (typeof window === "undefined") return;

  DEVICE_ID = getDeviceId();
  PLATFORM_NAME = getPlatform();
  QUERY = getQueryParams();

  const fp: any = await getVisitorId();
  if (fp) ({ visitorId: VISITOR_ID, requestId: REQUEST_ID } = fp);

  await onSaveLocal();
}

// 配置信息入口 - same name
export async function setConfig(value: EmptyObjectType) {
  if (!value || typeof value !== "object") return;

  if (value.appId) setAppId(value.appId);
  if (value.productId) setProductId(value.productId);
  if (value.backendURL) setBackendURL(value.backendURL);
  if (value.clickType) setActionType(value.clickType);

  await onInit();
  if (value.appId) return await onHandle();
}
