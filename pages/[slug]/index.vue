<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  
  import CategoryMenu from "~/components/desktop/home/CategoryMenu.vue";
  import ContentDisplay from "~/components/desktop/home/ContentDisplay.vue";
  const { postFilter, actorFilter, subjectFilter, tagTop, comments } =
    useHome();
  const state = reactive({
    subjects: [] as EmptyArrayType,
    latests: [] as EmptyArrayType,
    paginate: {
      page: 1,
      limit: 10,
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
  const {
    data: subject,
    error: subjectError,
    pending: subjectPending,
  } = await useApiFetch<EmptyObjectType>("/api/home/subject", {
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
    if (subject.value) {
      state.subjects = subject.value.items ?? [];
    }
  });
  const page = computed(() => state.paginate.page);
  const { data: latest } = await useAsyncData<any>(
    "latest",
    () =>
      $fetch("/api/home/latest", {
        method: "POST",
        body: {
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
    if (latest.value) {
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
  <v-container class="mt-4" >
    <!-- Categories -->
    <CategoryMenu />
    <ContentDisplay
      :subjects="state.subjects"
      :latests="state.latests"
      :paginate="state.paginate"
      :actor-filter="actorFilter?.items"
      :post-filter="postFilter?.items"
      :subject-filter="subjectFilter?.items"
      :tag-top="tagTop?.items"
      :comments="comments"
      @page-change="onPageChange"
    />
    <NuxtPage/>
  </v-container>
</template>

<style scoped lang="scss">
  .bullet-list .v-list-item {
    :deep(.v-list-item-title::before) {
      content: "•";
      margin-right: 8px;
      color: currentColor;
    }
  }
</style>
