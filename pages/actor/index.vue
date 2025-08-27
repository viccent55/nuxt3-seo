<script lang="ts" setup>
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });
  const store = useStore();
  useSeo(
    computed(() => store.configuration?.actor_seo_title),
    computed(() => store.configuration?.actor_seo_description),
    computed(() => store.configuration?.actor_seo_keywords)
  );
</script>
<template>
  <DesktopActorPage />
</template>
