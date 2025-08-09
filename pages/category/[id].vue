<script lang="ts" setup>
  import ContentDisplay from "~/components/desktop/home/ContentDisplay.vue";
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
  const { postFilter, actorFilter, tagTop, comments, subjectFilter, store } =
    useHome();

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
  const page = computed(() => state.paginate.page);
  const { data: latest } = await useAsyncData<any>(
    `latest-${route.params?.id}`,
    () =>
      $fetch("/api/home/latest", {
        method: "POST",
        body: {
          cid: Number(route.params?.id),
          page: state.paginate.page,
          limit: state.paginate.limit,
        },
      }),
    {
      watch: [page],
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

  const onPageChange = (newPage: number) => {
    state.paginate.page = newPage;
  };
</script>

<template>
  <ContentDisplay
    :subjects-card="subjectFilter?.items"
    :latests="state.latests"
    :paginate="state.paginate"
    :actor-filters="actorFilter?.items"
    :post-filters="postFilter?.items"
    :tag-tops="tagTop?.items"
    :comments="comments"
    :adverts="store.advertisement"
    @page-change="onPageChange"
  />
</template>
<style scoped lang="scss"></style>
