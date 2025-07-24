<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { useStore } from "~/store";

  const route = useRoute();
  const store = useStore();

  const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <v-bottom-navigation
    grow
    class="d-md-none"
    height="56"
    color="surface"
    elevation="3"
  >
    <v-btn
      v-for="(menu, index) in store.menus"
      :key="index"
      :to="menu.value"
      variant="text"
      :color="isActive(menu.value) ? 'primary' : ''"
      :class="isActive(menu.value) ? 'primary' : 'text-grey'"
    >
      <v-icon>{{ menu.icon }}</v-icon>
      <span class="text-caption">{{ menu.name }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
  .v-bottom-navigation {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    border-top: 1px solid rgba(var(--v-border-color), 0.12);
    background-color: rgb(var(--v-theme-surface));
  }
</style>
