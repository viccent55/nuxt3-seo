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
  <DesktopHomePageContent />
</template>
