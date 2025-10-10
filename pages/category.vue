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
  const indexChannel = ref<string>(channel.value);
  const categories = computed(() => [
    { name: "发现", value: "001" },
    ...(configuration.value.categories || []).map((item: EmptyObjectType) => ({
      name: item.name,
      value: item.id,
    })),
  ]);
</script>

<template>
  <v-container
    class="pa-0"
    fluid
  >
    <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
      @click-item="(v: EmptyObjectType) => (indexChannel = v.value)"
    />
    <NuxtPage />
  </v-container>
</template>
<style scoped lang="scss"></style>
