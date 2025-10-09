// composables/useApiFetch.ts

import { useStore } from "~/store";
import { useUserStore } from "~/store/user";

export const useApiFetch = async (
  url: string,
  options: EmptyObjectType = {}
) => {
  const userStore = useUserStore();
  let accessToken = userStore.token.access_token;
  let refreshToken = userStore.token.refresh_token;
  // Helper function to refresh the token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      // No refresh token, force logout or redirect to login.
      accessToken = "";
      return false;
    }
    const { data, error } = await useFetch<EmptyObjectType>(
      "/api/auth/refreshToken", // calls your local API handler
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        body: dataEncrypt({ refresh_token: refreshToken }),
      }
    );
    const decrypted = decrypt(data.value?.data);
    // res.data = decrypted;
    if (decrypted.data) {
      accessToken = decrypted.data.data.access_token;
      refreshToken = decrypted.data.data.refresh_token;
      return true;
    } else {
      // Refresh failed, logout
      accessToken = "";
      refreshToken = "";
      return false;
    }
  };

  // The core request logic
  const makeRequest = async (attemptedRefresh = false) => {
    const res: EmptyObjectType = await $fetch<EmptyObjectType>(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`, // always fresh
      },
    });
    if (res.data) {
      return res;
    }
    if (
      (res.errcode === 401013 || res.errcode === 401015) &&
      !attemptedRefresh
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return makeRequest(true); // retry with new token
      } else {
        const store = useStore();
        // store.setUserInfo({});
        return { data: null, error: 1, message: "Login required!" };
      }
    }
    return res;
  };

  return await makeRequest();
};
