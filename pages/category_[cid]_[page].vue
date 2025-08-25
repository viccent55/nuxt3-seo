<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
  const state = reactive({
    latests: [] as EmptyArrayType,
    paginate: {
      page: 1,
      limit: 30,
      total: 0,
    },
    filter: {
      field: "home",
      with_actor: 1,
      with_post: 1,
      page: 1,
      limit: 6,
    },
  });

  const route = useRoute();
  const cid = computed(() => route.params.cid);
  const page = computed(() => {
    const pageParam = route.params.page as string;
    // Assuming page format is like 'p-2', we extract '2'
    return pageParam?.split('-')[1] || '1';
  });

  const { data: latest } = await useAsyncData<any>(
    `category-${cid.value}-${page.value}`,
    () =>
      $fetch("/api/category", {
        method: "POST",
        body: {
          cid: cid.value,
          page: page.value,
          limit: state.paginate.limit,
        },
      }),
    {
      watch: [cid, page],
      transform: (res) => {
        state.latests = [];
        // ✅ Filter or map your data here
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );

  watchEffect(() => {
    if (latest.value?.items) {
      state.latests = latest.value.items ?? [];
      if (latest.value.count) {
        state.paginate.total = latest.value.count;
      }
    }
  });
</script>

<template>
  <DesktopCategoryPage />
</template>
<style scoped lang="scss"></style>
