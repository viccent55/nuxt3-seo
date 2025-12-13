<script lang="ts" setup>
  import { useDisplay } from "vuetify";

  definePageMeta({
    keepalive: true,
  });

  const { store, route } = useVariable();
  const { smAndDown } = useDisplay();
  const { configuration } = storeToRefs(store);
  const categorySeo = computed(() =>
    configuration.value?.categories?.find(
      (item: EmptyObjectType) => item.id == route.params.id
    )
  );
  useSeo(
    computed(() => categorySeo.value?.seo_title),
    computed(() => categorySeo.value?.seo_description),
    computed(() => categorySeo.value?.seo_keywords)
  );
  const heightOffset = computed(() => {
    if (smAndDown.value) {
      return "220px";
    }
    return "160px";
  });
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
    max-height: calc(100vh - v-bind(heightOffset));
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    scrollbar-width: none;
  }
</style>
