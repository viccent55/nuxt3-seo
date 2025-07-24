import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";

export function useApiFetch<T>(url: string, options: any = {}) {
  const auth = useAuthStore();
  const store = useStore();

  return useFetch<T>(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(auth.access_token
        ? { Authorization: `Bearer ${auth.access_token}` }
        : {}),
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.clearToken();
        store.clearUserInfo;
      }
    },
  });
}
