<script lang="ts" setup>
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });

  const store = useStore();
  // const state = reactive({
  //   latests: [] as EmptyArrayType,
  //   paginate: {
  //     page: 1,
  //     limit: 30,
  //     total: 0,
  //   },
  //   filter: {
  //     field: "home",
  //     with_actor: 1,
  //     with_post: 1,
  //     page: 1,
  //     limit: 6,
  //   },
  // });

  // const route = useRoute();
  // const cid = computed(() => route.params.cid);
  // const page = computed(() => state.paginate.page);

  // const { data: latest } = await useAsyncData<any>(
  //   `category-${cid.value}-${page.value}`,
  //   () =>
  //     $fetch("/api/category", {
  //       method: "POST",
  //       body: {
  //         cid: cid.value,
  //         page: state.paginate.page,
  //         limit: state.paginate.limit,
  //       },
  //     }),
  //   {
  //     watch: [cid, page],
  //     transform: (res) => {
  //       state.latests = [];
  //       // ✅ Filter or map your data here
  //       return {
  //         items: res.data.items || [],
  //         count: res.data.count || 0,
  //         extends: res.data.extends || [],
  //       };
  //     },
  //   }
  // );

  // watchEffect(() => {
  //   if (latest.value?.items) {
  //     state.latests = latest.value.items ?? [];
  //     if (latest.value.count) {
  //       state.paginate.total = latest.value.count;
  //     }
  //   }
  // });

  // useSeo();
  // computed(() => latest.value.extends.seo_title),
  // computed(() => latest.value.extends?.seo_description),
  // computed(() => latest.value.extends?.seo_title)
  // );
  const { configuration, channel, mode } = storeToRefs(store);
</script>

<template>
  <div class="explore-wrapper">
    <!-- <h1 class="d-none">小红书成人版-记录性福每一天</h1> -->
    <ExploreCategoryPage />
  </div>
</template>
<style scoped lang="scss">
  .explore-wrapper {
    width: 100%;
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    scrollbar-width: none;
  }
</style>
