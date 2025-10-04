export function adsClick(params: object) {
  return $fetch("/api/ads/advert.click", { method: "POST", body: params });
}
export function itemAdClick(params: object) {
  return $fetch("/api/ads/advert.ad.click", { method: "POST", body: params });
}

export function pwaInstalled(params: object) {
  return $fetch("/api/app/pwa", { method: "POST", body: params });
}

export function firstVisitInApp(params: object) {
  return $fetch("/api/app/firstVisitInApp", { method: "POST", params });
}

export async function getPositionAds(position: number) {
  const res: EmptyObjectType = await $fetch("/api/ads/position", {
    method: "GET",
    params: { position },
  });
  const item = decrypt(res?.data);
  return item;
}

export function login(params: object) {
  return $fetch("/api/auth/login", { method: "POST", params });
}
export function register(params: object) {
  return $fetch("/api/app/register", { method: "POST", params });
}

export function forgotPassword(params?: object) {
  return $fetch("/api/auth/forgotPassword", { method: "POST", params });
}
export function resetPassword(params: object) {
  return $fetch("/api/app/setPassword", { method: "POST", params });
}
