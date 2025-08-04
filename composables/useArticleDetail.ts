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
        useSeo({
          seo_title: res.data?.title,
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
    seo_title: articleDetail.value?.title,
    seo_keywords: articleDetail.value?.seo_keywords,
    home_description: articleDetail.value?.seo_description,
  });

  return {
    articleDetail,
    pending,
    error,
  };
}
