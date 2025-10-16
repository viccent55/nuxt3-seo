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
    class="pa-2"
  >
    main page
  </v-container>
</template>

<style scoped lang="scss"></style>
