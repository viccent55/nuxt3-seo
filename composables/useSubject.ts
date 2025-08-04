export default function useSubject() {
  const route = useRoute();

  const {
    data: subjectData,
    pending,
    error,
  } = useAsyncData<EmptyObjectType>(
    () => `subject-detail-${route.params.id}`,
    () =>
      $fetch("/api/subject/detail", {
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
          seo_description: res.data?.seo_description,
        });
        return {
          ...res?.data,
        };
      },
    }
  );
  useSeo({
    seo_title: subjectData.value?.seo_title,
    seo_keywords: subjectData.value?.seo_keywords,
    home_description: subjectData.value?.seo_description,
  });
  // Reactive second request: only fetch when subjectData is ready
  const subjectFilters = ref({
    items: [] as EmptyArrayType,
    count: 0,
  });

  watchEffect(async () => {
    if (subjectData.value?.id) {
      const res = await $fetch<any>("/api/subject/filter", {
        method: "POST",
        body: {
          field: "hot",
          sid: subjectData.value.id,
        },
      });

      subjectFilters.value = {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    }
  });

  return {
    subjectData,
    subjectFilters,
    pending,
    error,
  };
}
