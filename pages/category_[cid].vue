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
  const page = computed(() => state.paginate.page);

  const { data: latest } = await useAsyncData<any>(
    `category-${cid.value}-${page.value}`,
    () =>
      $fetch("/api/category", {
        method: "POST",
        body: {
          cid: cid.value,
          page: state.paginate.page,
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
