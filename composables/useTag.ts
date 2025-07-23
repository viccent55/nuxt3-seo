export default function useTag() {
  const route = useRoute();

  const {
    data: tagData,
    pending,
    error,
  } = useAsyncData<EmptyObjectType>(
    () => `tag-group`,
    () =>
      $fetch("/api/tag/group", {
        method: "POST",
        body: {},
      }),
    {
      transform: (res: EmptyObjectType) => {
        return {
          ...res?.data,
        };
      },
    }
  );
  const { data: tagDetail } = useAsyncData<EmptyObjectType>(
    () => `tag-detail-${route.params.id}`,
    () =>
      $fetch("/api/tag/detail", {
        method: "POST",
        body: {
          id: route.params.id,
        },
      }),
    {
      watch: [() => route.params.id],
      transform: (res: EmptyObjectType) => {
        return {
          ...res?.data,
        };
      },
    }
  );
   // Reactive second request: only fetch when tagData is ready
  const tagFilters = ref({
    items: [] as EmptyArrayType,
    count: 0,
  });

  watchEffect(async () => {
    if (tagDetail.value?.id) {
      const res = await $fetch<any>("/api/tag/filter", {
        method: "POST",
        body: {
          page: 1,
          limit: 30,
          sid: tagDetail.value.id,
        },
      });

      tagFilters.value = {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    }
  });
  return {
    tagData,
    pending,
    error,
    tagDetail,
    tagFilters,
  };
}
