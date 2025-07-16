import service from "~/utils/request";

export default function useApi() {
  return {
    getConfigLogo: (params?: object) => {
      return service({
        url: "getConfigurationList",
        method: "get",
        params,
      });
    },
    getAlltags: (params?: object) => {
      return service.post("tag/group", params);
    },
  };
}
