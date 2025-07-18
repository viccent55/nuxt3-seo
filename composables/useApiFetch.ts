import { useAuthStore } from "~/store/auth";

export function useApiFetch<T>(url: string, options: any = {}) {
  const auth = useAuthStore();

  return useFetch<T>(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.clearToken();
        navigateTo("/login");
      }
    },
  });
}
