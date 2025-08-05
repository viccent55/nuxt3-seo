<script lang="ts" setup>
  import { useStore } from "~/store";

  const store = useStore();
  const route = useRoute();
</script>
<template>
  <!-- Scrollable Category Bar -->
  <v-toolbar
    class="category-scroll-wrapper px-4 mb-4"
    color="surface"
  >
    <v-slide-group
      show-arrows
      class="category-slide-group"
    >
      <v-slide-group-item
        v-for="(category, index) in store.configuration?.categories"
        :key="index"
      >
        <v-btn
          variant="text"
          class="text-button"
          height="36"
          density="compact"
          :to="`/category-${category.id}`"
          :class="{
            'router-link-exact-active':
              `category-${category.id}` === route.params.slug,
          }"
        >
          {{ category.name }}
        </v-btn>
        <v-divider
          v-if="index < store.configuration?.categories?.length - 1"
          vertical
          class="mx-1 mt-2"
          length="18"
        />
      </v-slide-group-item>
    </v-slide-group>
  </v-toolbar>
</template>

<style scoped lang="scss">
  .category-scroll-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .category-slide-group {
    max-width: 100%;
  }

  .text-button {
    white-space: nowrap;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    transition: color 0.2s ease;
  }

  .text-button:hover {
    color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.08);
  }

  .router-link-exact-active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
  }
</style>
