import service from "~/utils/request";

export default function useApi() {
	return {
		getConfigLogo: (params?: object) => {
			return service({
				url: 'getConfigurationList',
				method: 'get',
				params,
			});
		},
  }
}
