<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import type { ExploreChannelItem } from "@/types/item";
  import useVariable from "@/composables/useVariable";
  import { adsClick } from "@/service/advert";
  import { useDisplay } from "vuetify";

  defineProps<{
    items: ExploreChannelItem[];
    activeValue: string | number;
  }>();

  defineEmits(["click-item"]);

  const { smAndDown } = useDisplay();
  const { store, route } = useVariable();
  const selected = ref(route.params.id || "001");

  const itemClick = (item: any) => {
    adsClick(item.id);
  };

  watch(
    () => route.params.id,
    (newCid) => {
      selected.value = newCid || "001";
    }
  );

  onUnmounted(() => {});
</script>

<template>
  <div>
    <!-- Channel Bar -->
    <!-- Scrollable category bar -->
    <v-slide-group
      ref="group"
      v-model="selected"
      show-arrows
      class="flex-grow-1 pt-4 pb-0 custom-slide"
    >
      <v-slide-group-item
        v-for="(item, index) in items"
        :key="index"
        :value="item.value"
      >
        <v-btn
          :color="selected == item.value ? 'red' : undefined"
          :variant="selected == item.value ? 'flat' : 'text'"
          rounded="xl"
          class="mx-1 text-surface-variant px-2 px-md-4"
          @click="$emit('click-item', item)"
          :to="item.value == '001' ? '/' : `/category/${item.value}`"
          :density="smAndDown ? 'compact' : 'default'"
        >
          <span class="text-xs pa-0 ma-0 text-body-2">{{ item.name }}</span>
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
    <!-- Ads Grid -->
    <div
      class="grid grid-cols-5 md:grid-cols-10 gap-1 justify-items-center mb-5"
    >
      <a
        v-for="(app, index) in store?.homeAds"
        :key="index"
        :href="app.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center space-y-2 hover:opacity-80"
        @click="itemClick(app)"
        v-show="index < 10"
      >
        <AdvertSlot
          :advert="{ title: app.name, image: app.image, url: app?.url }"
          fit="cover"
          style="width: 55px; height: 55px"
        />
        <span class="text-xs info">{{ app.name }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .channel-bar-container {
    display: flex;
    align-items: center;
    height: 72px;
    width: 100%;

    .arrow-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0 8px;
      color: var(--v-theme-primary);
      flex-shrink: 0;
    }

    .channel-scrollbar {
      flex-grow: 1;

      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  :deep(.custom-slide) {
    .v-slide-group__next,
    .v-slide-group__prev {
      flex: 0 1 40px;
      min-width: 40px;
    }
  }
</style>
