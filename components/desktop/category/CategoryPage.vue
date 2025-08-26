<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
  const { store } = useHome();
</script>

<template>
  <v-container class="pt-0">
    <!-- Categories -->
    <DesktopHomeCategoryMenu />
    <DesktopCategoryPageContent />
  </v-container>
</template>
<style scoped lang="scss"></style>
