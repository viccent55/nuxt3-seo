// composables/useApiFetch.ts

import { useStore } from "~/store";

export const useApiFetch = async (
  url: string,
  options: EmptyObjectType = {}
) => {
  const accessToken = useCookie("access_token");
  const refreshToken = useCookie("refresh_token");
  // Helper function to refresh the token
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      // No refresh token, force logout or redirect to login.
      accessToken.value = null;
      return false;
    }
    const { data, error } = await useFetch<EmptyObjectType>(
      "/api/member/refresh-token", // calls your local API handler
      {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      }
    );

    if (data.value) {
      accessToken.value = data.value.data.access_token;
      refreshToken.value = data.value.data.refresh_token;
      return true;
    } else {
      // Refresh failed, logout
      accessToken.value = null;
      refreshToken.value = null;
      return false;
    }
  };

  // The core request logic
  const makeRequest = async (attemptedRefresh = false) => {
    const { data, error } = await useFetch<any>(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`, // always fresh
      },
    });

    if (
      (data.value?.code === 401013 || data.value?.code === 401015) &&
      !attemptedRefresh
    ) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return makeRequest(true); // retry with new token
      } else {
        const store = useStore();
        store.setUserInfo({});
        return { data: null, error: 1, message: "Login required!" };
      }
    }

    return { data, error };
  };

  return await makeRequest();
};
