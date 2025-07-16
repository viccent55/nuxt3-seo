import axios, { type AxiosInstance } from "axios";
import qs from "qs";
import useSnackbar from "~/composables/useSnackbar";

//Configure a new axios instance
const service: AxiosInstance = axios.create({
  baseURL: "/apiv1/",
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});

// Add request interceptor
service.interceptors.request.use(
  (config) => {
    // What to do before sending a request token
    // if (store.accessToken) {
    //     config.headers!['Authorization'] = `${atob(store.accessToken)}`;
    // }
    return config;
  },
  (error) => {
    // What to do about request errors
    return Promise.reject(error);
  }
);
// Add response interceptor
service.interceptors.response.use(
  (response) => {
    // Do something with the response data
    const res = response.data;
    if (res.code && res.code !== 200) {
      // ElMessage.error(response.error);
      return response.data;
    } else {
      return res;
    }
  },
  (error) => {
    // Do something about the response error
    if (error.message.indexOf("timeout") != -1) {
      useSnackbar().showSnackbar("network timeout");
    } else if (error.message == "Network Error") {
      useSnackbar().showSnackbar("Network connection error");
    } else {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        "Interface path not found";
      useSnackbar().showSnackbar(errorMessage);
    }
    return Promise.reject(error);
  }
);

// Export axios instance
export default service;
