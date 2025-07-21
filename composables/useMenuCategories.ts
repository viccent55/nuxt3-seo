import { ref } from "vue";

export default function useMenuCategories() {
  const { data: homeConfig } = useFetch<any>("/api/config", {
    method: "POST",
    body: {},
    transform: (res: EmptyObjectType) => {
      return {
        ...res?.data,
      };
    },
  });

  return {
    homeConfig,
  };
}
