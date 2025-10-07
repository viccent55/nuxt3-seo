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
