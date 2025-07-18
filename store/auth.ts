// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);

  const setToken = (value: string) => {
    token.value = value;
    useCookie('token').value = value; // optional: sync to cookie
  };

  const clearToken = () => {
    token.value = null;
    useCookie('token').value = null; // also remove cookie
  };

  return {
    token,
    setToken,
    clearToken,
  };
});
