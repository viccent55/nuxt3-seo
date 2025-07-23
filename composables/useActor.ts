export default function useActor() {
  const route = useRoute();

  const {
    data: actorData,
    pending,
    error,
  } = useAsyncData<EmptyObjectType>(
    () => `actor-detail-${route.params.id}`,
    () =>
      $fetch("/api/actor/detail", {
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

  // Reactive second request: only fetch when subjectData is ready
  const actorFilters = ref({
    items: [] as EmptyArrayType,
    count: 0,
  });

  watchEffect(async () => {
    if (actorData.value?.id) {
      const res = await $fetch<any>("/api/actor/filter", {
        method: "POST",
        body: {
          page: 1,
          limit: 30,
          aid: route.params.id,
        },
      });

      actorFilters.value = {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    }
  });

  return {
    actorData,
    actorFilters,
    pending,
    error,
  };
}
