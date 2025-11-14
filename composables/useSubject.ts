export default function useSubject() {
  const route = useRoute();
  const contentArticleRef = ref();

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
        contentArticleRef.value?.init(res.data.content);
        return {
          ...res?.data,
        };
      },
    }
  );

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
    contentArticleRef,
  };
}
