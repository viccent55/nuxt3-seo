<script setup lang="ts">
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });
  const store = useStore();
  const { configuration } = storeToRefs(store);
  useSeo(
    computed(() => configuration.value.home_title),
    computed(() => configuration.value?.home_description),
    computed(() => configuration.value?.home_keywords)
  );
  const indexChannel = ref<string>("001");
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
    <h1 class="d-none">小红书成人版-记录性福每一天</h1>
    <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
    />
    <ExplorePageContent />
  </v-container>
</template>

<style scoped>
  .explore-wrapper {
    width: 100%;
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    scrollbar-width: none;
  }
</style>
