export default function useArticleDetail() {
  const route = useRoute();

  const {
    data: articleDetail,
    pending,
    error,
  } = useAsyncData<EmptyObjectType>(
    () => `article-detail-${route.params.id}`,
    () =>
      $fetch("/api/article/detail", {
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
    items: [] as EmptyArrayType,
    count: 0,
  });

  // watchEffect(async () => {
  //   if (articleDetail.value?.id) {
  //     const res = await $fetch<any>("/api/subject/filter", {
  //       method: "POST",
  //       body: {
  //         sid: articleDetail.value.id,
  //       },
  //     });

  //     postSubjectData.value = {
  //       items: res.data.items || [],
  //       count: res.data.count || 0,
  //     };
  //   }
  // });

  return {
    articleDetail,
    pending,
    error,
  };
}
