import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";

export function useApiFetch<T>(url: string, options: any = {}) {
  const access_token = useCookie("access_token");
  const auth = useAuthStore();
  const store = useStore();
  return useFetch<T>(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(access_token.value
        ? { Authorization: `Bearer ${access_token.value}` }
        : {}),
    },
    onResponse({ response }) {
      // Optional: log or handle response
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.clearToken();
        store.clearUserInfo(); // <- fix here
      }
    },
  });
}
