import { useStore } from "~/store";
// stores/auth.ts
export const useAuthStore = defineStore("auth", () => {
  const access_token = ref<string | null>(null);
  const store = useStore();
  const setToken = (item: { access_token: string; refresh_token: string }) => {
    access_token.value = item.access_token;
    useCookie("access_token").value = item.access_token; // optional: sync to cookie
  };

  const clearToken = () => {
    access_token.value = null;
    useCookie("access_token").value = null; // also remove cookie
    store.clearUserInfo();
    navigateTo("/");
  };

  return {
    access_token,
    setToken,
    clearToken,
  };
});
