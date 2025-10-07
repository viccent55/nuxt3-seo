export function pwaInstalled(params: object) {
  return $fetch("/api/app/pwa", { method: "POST", body: params });
}

export function firstVisitInApp(params: object) {
  return $fetch("/api/app/firstVisitInApp", { method: "POST", params });
}