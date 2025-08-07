// composables/useApiFetch.ts
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
      "/api/member/refresh-token",
      {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      }
    );

    if (data.value) {
      accessToken.value = data.value.accessToken;
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
    // Add the access token to the request headers
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken.value}`,
    };

    const { data, error } = await useFetch(url, {
      ...options,
      headers,
    });

    if (error.value?.statusCode === 401 && !attemptedRefresh) {
      // Access token expired, attempt to refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // If successful, retry the original request
        return makeRequest(true);
      } else {
        // Refresh failed, handle logout
        return { data: null, error: "Login required." };
      }
    }
    return { data, error };
  };

  return makeRequest();
};
