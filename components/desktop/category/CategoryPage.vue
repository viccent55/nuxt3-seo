<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
</script>

<template>
  <v-container class="pt-0">
    <!-- Categories -->
    <DesktopHomeCategoryMenu />
    <DesktopCategoryPageContent />
  </v-container>
</template>
<style scoped lang="scss"></style>
