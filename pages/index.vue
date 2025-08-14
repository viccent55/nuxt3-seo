<script lang="ts" setup>
  import ContentDisplay from "~/components/desktop/home/ContentDisplay.vue";
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
  const { postFilter, actorFilter, tagTop, comments, subjectFilter, store } =
    useHome();

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
    if (latest.value?.items) {
      state.latests = latest.value.items ?? [];
      if (latest.value.count) {
        state.paginate.total = latest.value.count;
      }
    }
  });

  const onPageChange = (newPage: number) => {
    console.log(newPage)
    
    state.paginate.page = newPage;
  };
</script>

<template>
  <v-container class="pt-0">
    <!-- Categories -->
    <DesktopHomeCategoryMenu v-if="$route?.name === 'index'" />
    <ContentDisplay
      :subjects="state.subjects"
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
    <NuxtPage />
    <v-row class="mt-2">
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in store.advertisement?.POSITION_HOME_BOTTOM"
        :key="index"
      >
        <DesktopAdvertSlot :advert="item" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
