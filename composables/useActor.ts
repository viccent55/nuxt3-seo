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
        useSeo({
          seo_title: res.data?.seo_title,
          seo_keywords: res.data?.seo_keywords,
          home_description: res.data?.seo_description,
        });
        return {
          ...res?.data,
        };
      },
    }
  );
  useSeo({
    seo_title: actorData.value?.seo_title,
    seo_keywords: actorData.value?.seo_keywords,
    home_description: actorData.value?.seo_description,
  });
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
          field: "hot",
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
