<script setup lang="ts">
  import type { NavigationItem } from "@/types/item";
  import { dropDownItems3 } from "@/common";
  import useVariable from "@/composables/useVariable";
  import { NavigationItems } from "@/common";

  const emit = defineEmits(["click-menu-item", "click-nav-item"]);

  defineProps<{
    items: NavigationItem[];
    activeItem: string;
  }>();

  const { route, store } = useVariable();

  // Watch for route changes to keep the footer in sync.
  watch(
    () => route.name,
    (name) => {
      // Find a matching navigation item.
      // First, try for an exact match (e.g., 'index').
      // If not found, try matching the base of the route name (e.g., 'category' for 'category-id').
      const navItem = NavigationItems.find((item) => {
        const routeBaseName = String(name).split("-")[0];
        return item.routeName === name || item.routeName === routeBaseName;
      });
      if (navItem) store.mode = navItem.mode;
    }
  );
</script>

<template>
  <v-bottom-navigation
    app
    height="90"
    class="footer bg-surface app-footer"
    density="comfortable"
    :model-value="store.mode"
  >
    <template
      v-for="item in items"
      :key="item.name"
    >
      <v-btn
        class="channel-wrapper"
        variant="text"
        style="min-width: 0; padding: 0"
        @click="
          () => {
            emit('click-nav-item', item);
          }
        "
        :class="store.mode === item.mode ? 'text-primary' : undefined"
      >
        <v-icon
          :icon="`mdi-${item.icon.toLowerCase()}`"
          size="24"
        />
        <span class="text-sm mt-1">
          {{ item.name }}
        </span>
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<style scoped lang="scss">
  /* In your main CSS file or footer component <style> */

  .app-footer {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 10;
    /* Add padding equal to the bottom safe area inset */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .footer {
    z-index: 16;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    // Hide on desktop
    @media (min-width: 960px) {
      display: none;
    }
  }

  .channel-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
