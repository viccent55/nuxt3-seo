<script lang="ts" setup>
  import CategoryMenu from "~/components/desktop/home/CategoryMenu.vue";
  import ContentDisplay from "~/components/desktop/home/ContentDisplay.vue";
  const { postFilter, actorFilter, subjectFilter, tagTop, comments } =
    useHome();
  const functionHelper = useFunctionHelper;

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

  const POSITION_HOME_LIST = 1;
  const POSITION_HOME_BOTTOM = 2;
  const POSITION_HOME_RIGHT = 3;

  const { data: advertData } = await useFetch<any>("/api/home/ads", {
    method: "POST",
    body: {
      positions: [
        POSITION_HOME_LIST,
        POSITION_HOME_BOTTOM,
        POSITION_HOME_RIGHT,
      ],
    },
  });

  const adverts = computed(() => advertData.value?.data || []);
</script>

<template>
  <v-container class="mt-md-2">
    <!-- Categories -->
    <CategoryMenu v-if="$vuetify.display.mdAndUp" />
    <ContentDisplay
      :subjects="state.subjects"
      :latests="state.latests"
      :paginate="state.paginate"
      :actor-filters="actorFilter?.items"
      :post-filters="postFilter?.items"
      :subject-filters="subjectFilter?.items"
      :tag-tops="tagTop?.items"
      :comments="comments"
      :adverts="adverts"
      :postion-list="POSITION_HOME_LIST"
      @page-change="onPageChange"
    />
    <NuxtPage />
    <v-row dense class="mt-2">
      <v-col
        cols="6"
        v-for="(item, index) in adverts[2]"
        :key="index"
      >
        <DesktopAdvertSlot :advert="item" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
