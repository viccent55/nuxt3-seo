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
    const response: EmptyObjectType = await $fetch(
      "/api/auth/refreshToken", // calls your local API handler
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        body: dataEncrypt({}),
      }
    );
    if (response.data) {
      const data = decrypt(response.data);
      userStore.token = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      accessToken = data.access_token;
      refreshToken = data.refresh_token;

      return true;
    } else {
      console.log("response.data", response);
      // Refresh failed, logout
      accessToken = "";
      refreshToken = "";
      userStore.logout();
      return false;
    }
  };

  // The core request logic
  const makeRequest = async (attemptedRefresh = false) => {
    const res: EmptyObjectType = await $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`, // always fresh
      },
    });
    if (res.data) {
      return res;
    }
    const storeUser = useUserStore();
    if (res.errcode === 401023) {
      storeUser.logout(); // logout
    }
    if (
      (res.errcode === 401013 ||
        res.errcode === 401015 ||
        res.errcode == 401011) &&
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
