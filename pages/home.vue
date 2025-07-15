<script lang="ts" setup>
import useMenuCategories from '../composables/useMenuCategoies';
definePageMeta({
  middleware: ["home"],
})

const { menuCategories } = useMenuCategories();
</script>

<template>
  <v-container class="px-0 mt-4">
    <!-- Shared Categories Menu -->
    <v-toolbar class="d-flex bg-white px-8 rounded-lg">
      <template
        v-for="(category, index) in menuCategories"
        :key="category.path"
      >
        <NuxtLink
          :to="category.path"
          class="text-button"
        >
          {{ category.name }}
        </NuxtLink>
        <v-divider
          v-if="index < menuCategories.length - 1"
          vertical
          class="mx-4 "
          length="18"
        />
      </template>
    </v-toolbar>
    <!-- Show child page content -->
    <NuxtPage />
  </v-container>
</template>
<style scoped>
  .v-toolbar :deep(.v-divider) {
    align-self: center;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
