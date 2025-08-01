<script lang="ts" setup>
  import CategoryMenu from "~/components/desktop/home/CategoryMenu.vue";
  import ContentDisplay from "~/components/desktop/home/ContentDisplay.vue";
  
  const { postFilter, actorFilter, tagTop, comments, subjectFilter } =
    useHome();
  const { isMobile } = useVariable();
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
    ads: {} as EmptyObjectType,
    POSITION_HOME_LIST: 1,
    POSITION_HOME_BOTTOM: 2,
    POSITION_HOME_RIGHT: 3,
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
    if (subject.value?.items) {
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
    state.paginate.page = newPage;
  };

  const { data: advertData } = await useFetch<any>("/api/home/ads", {
    method: "POST",
    body: {
      positions: [
        state.POSITION_HOME_LIST,
        state.POSITION_HOME_BOTTOM,
        state.POSITION_HOME_RIGHT,
      ],
    },
  });
  watchEffect(() => {
    if (advertData.value.data) {
      const mapping: Record<number | string, string> = {
        [state.POSITION_HOME_LIST]: "POSITION_HOME_LIST",
        [state.POSITION_HOME_BOTTOM]: "POSITION_HOME_BOTTOM",
        [state.POSITION_HOME_RIGHT]: "POSITION_HOME_RIGHT",
      };

      for (const key in advertData.value.data) {
        const mappedKey = mapping[key];
        if (mappedKey) {
          state.ads[mappedKey] = advertData.value.data[key];
        }
      }
    }
  });
</script>

<template>
  <v-container class="mt-md-2">
    <!-- Categories -->
    <CategoryMenu v-if="!isMobile" />
    <ContentDisplay
      :subjects="state.subjects"
      :subjects-card="subjectFilter?.items"
      :latests="state.latests"
      :paginate="state.paginate"
      :actor-filters="actorFilter?.items"
      :post-filters="postFilter?.items"
      :tag-tops="tagTop?.items"
      :comments="comments"
      :adverts="state.ads"
      @page-change="onPageChange"
    />
    <NuxtPage />
    <v-row class="mt-2">
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in state.ads?.POSITION_HOME_BOTTOM"
        :key="index"
      >
        <DesktopAdvertSlot :advert="item" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
