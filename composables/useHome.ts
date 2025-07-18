export default function useHome() {
  const { data: filterHome } = useApiFetch<any>("/api/home/filter", {
    method: "POST",
    body: {
      page: 1,
      limit: 5,
      field: "home",
    },
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    },
  });
  return {
    filterHome,
  };
}
