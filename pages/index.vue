<script setup lang="ts">
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });
  const store = useStore();
  const { configuration } = storeToRefs(store);
  useSeo({
    seo_title: configuration.value.home_title,
    seo_description: configuration.value.home_description,
    seo_keywords: configuration.value.home_keywords,
  });
</script>

<template>
  <DesktopHomePageContent />
</template>
