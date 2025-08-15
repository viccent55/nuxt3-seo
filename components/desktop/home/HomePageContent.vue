<script lang="ts" setup>
  useSeo({});

  const state = reactive({
    subjects: [] as EmptyArrayType,
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
  const { postFilter, actorFilter, tagTop, comments, subjectFilter, store } =
    useHome();
  const { route } = useVariable();

  const { data: subject } = await useApiFetch("/api/home/subject", {
    method: "POST",
    body: state.filter,
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    },
  });

  watchEffect(() => {
    if (subject?.value.items) {
      state.subjects = subject.value.items ?? [];
    }
  });
  const page = computed(() => route.params?.id);
  const { data: latest } = await useAsyncData<any>(
    `latest-${page.value}`,
    () =>
      $fetch("/api/home/latest", {
        method: "POST",
        body: {
          page: page.value || 1,
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
    if(route.params.id) {
      state.paginate.page = Number(route.params.id);
    }
  });
</script>

<template>
  <v-container class="pt-0">
    <DesktopHomeCategoryMenu />
    <DesktopHomeContentDisplay
      :subjects="state.subjects"
      :subjects-card="subjectFilter?.items"
      :latests="state.latests"
      :paginate="state.paginate"
      :actor-filters="actorFilter?.items"
      :post-filters="postFilter?.items"
      :tag-tops="tagTop?.items"
      :comments="comments"
      :adverts="store.advertisement"
    />
  </v-container>
</template>
<style scoped lang="scss"></style>
