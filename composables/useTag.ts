export default function useTag() {
  const route = useRoute();

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
    seo_title: tagDetail.value?.seo_title,
    seo_keywords: tagDetail.value?.seo_keywords,
    home_description: tagDetail.value?.seo_description,
  });

  // Reactive second request: only fetch when tagData is ready
  const tagFilters = reactive({
    items: [] as EmptyArrayType,
    count: 0,
    loading: false,
  });

  watchEffect(async () => {
    if (tagDetail.value?.id) {
      try {
        const res = await $fetch<any>("/api/tag/filter", {
          method: "POST",
          body: {
            tid: tagDetail.value.id,
          },
        });

        tagFilters.items = res.data.items || [];
        tagFilters.count = res.data.count || 0;
      } catch (e) {
        console.error("Failed to fetch tag filters", e);
      } finally {
        tagFilters.loading = false;
      }
    }
  });

  // Reactive second request: only fetch when tagData is ready
  const tagPosts = reactive({
    items: [] as EmptyArrayType,
    count: 0,
    loading: false,
  });

  watchEffect(async () => {
    if (tagDetail.value?.id) {
      const res = await $fetch<any>("/api/tag/post", {
        method: "POST",
        body: {
          limit: 5,
        },
      });
      tagPosts.items = res.data || [];
      tagPosts.count = res.data.length || 0;
    }
  });
  return {
    tagDetail,
    tagFilters,
    tagPosts,
  };
}
