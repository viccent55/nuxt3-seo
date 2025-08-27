<script lang="ts" setup>
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });
  const store = useStore();

  useSeo(
    computed(() => store.configuration?.subject_seo_title),
    computed(() => store.configuration?.subject_seo_description),
    computed(() => store.configuration?.subject_seo_keywords)
  );
</script>

<template>
  <DesktopSubjectPage />
</template>
