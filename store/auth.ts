import { useStore } from "~/store";

// stores/auth.ts
export const useAuthStore = defineStore("auth", () => {
  const access_token = ref<string | null>(null);
  const store = useStore();
  const setToken = (item: { access_token: string; refresh_token: string }) => {
    access_token.value = item.access_token;
    useCookie("access_token").value = item.access_token;
    useCookie("refresh_token").value = item.refresh_token;
  };

  const clearToken = () => {
    access_token.value = null;
    useCookie("access_token").value = null;
    useCookie("refresh_token").value = null;
    navigateTo("/");
  };

  return {
    access_token,
    setToken,
    clearToken,
  };
});