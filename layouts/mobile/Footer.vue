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
  onMounted(() => {
    const routeName = NavigationItems.find(
      (item: EmptyObjectType) => item.href === route.path
    );
    if (routeName) {
      store.mode = routeName.mode;
    }
  });
</script>

<template>
  <v-bottom-navigation
    app
    height="90"
    class="footer bg-surface app-footer"
    density="comfortable"
  >
    <template
      v-for="item in items"
      :key="item.name"
    >
      <v-btn
        class="channel-wrapper"
        variant="text"
        stacked
        style="min-width: 0; padding: 0"
        @click="item.icon === 'Setting' ? null : emit('click-nav-item', item)"
        color="primary"
      >
        <!-- Dropdown for Setting -->
        <template v-if="item.icon === 'Setting'">
          <v-menu
            location="top"
            transition="fade-transition"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
              >
                <v-icon
                  :icon="`mdi-${item.icon.toLowerCase()}`"
                  size="24"
                />
              </v-btn>
            </template>

            <v-list density="compact">
              <v-list-item
                v-for="(sub, index) in dropDownItems3"
                :key="index"
                @click="emit('click-menu-item', sub)"
              >
                <v-list-item-title>{{ sub.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Normal button -->
        <template v-else>
          <v-icon
            :icon="`mdi-${item.icon.toLowerCase()}`"
            size="24"
          />
        </template>

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
