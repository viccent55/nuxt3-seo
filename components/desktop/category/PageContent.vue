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
      cid: 0,
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
  const catpage = computed(() => route.params.cid);
  const page = computed(() => route.params.id);
  const { data: latest } = await useAsyncData<any>(
    `latest-${route.params?.cid}-${route.params?.id}`,
    () =>
      $fetch("/api/category", {
        method: "POST",
        body: {
          cid: route.params?.cid,
          page: page.value,
          limit: state.paginate.limit,
        },
      }),
    {
      watch: [catpage, page],
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
  <ContentDisplay
    :subjects-card="subjectFilter?.items"
    :latests="state.latests"
    :paginate="state.paginate"
    :actor-filters="actorFilter?.items"
    :post-filters="postFilter?.items"
    :tag-tops="tagTop?.items"
    :comments="comments"
    :adverts="store.advertisement"
    :base-path="`/category/${catpage}/`"
  />
  
</template>
<style scoped lang="scss"></style>
