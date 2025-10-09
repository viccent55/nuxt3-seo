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
</script>

<template>
  <ExplorePageContent />
</template>

<style scoped>
  .explore-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 12px;
  }
</style>
