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
        return {
          ...res?.data,
        };
      },
    }
  );

  // Reactive second request: only fetch when subjectData is ready
  const postSubjectData = ref({
    items: [],
    count: 0,
  });

  watchEffect(async () => {
    if (subjectData.value?.id) {
      const res = await $fetch<any>("/api/subject/post-subject", {
        method: "POST",
        body: {
          sid: subjectData.value.id,
        },
      });

      postSubjectData.value = {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    }
  });

  return {
    subjectData,
    postSubjectData,
    pending,
    error,
  };
}
