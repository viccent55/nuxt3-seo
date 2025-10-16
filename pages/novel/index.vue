<script setup lang="ts">
  const { store, route } = useVariable();
  const { configuration } = storeToRefs(store);

  import { getCategories } from "~/service/novel";

  useSeo(
    computed(() => configuration.value?.novel_title),
    computed(() => configuration.value?.novel_description),
    computed(() => configuration.value?.novel_keywords)
  );

  const { data, pending } = await useAsyncData(
    "novel-categories",
    () => getCategories({}),
    {
      transform: (data: EmptyObjectType) => data?.data || [],
      default: () => [],
    }
  );

  // Redirect to the first category if we are on the base /novel route
  if (route.name === "novel" && data.value.length > 0) {
    await navigateTo(`/novel/${data.value[0].id}`, { redirectCode: 302 });
  }
</script>

<template>
  <v-container
    fluid
    style="min-height: 70vh"
    class="pa-2 d-flex justify-center align-center fill-height"
  >
    <v-empty-state
      headline="喔唷"
      title="暂无数据"
      text="该分类下没有内容"
      icon="mdi-folder-open-outline"
    ></v-empty-state>
  </v-container>
</template>

<style scoped lang="scss"></style>
