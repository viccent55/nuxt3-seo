<script setup lang="ts">
  import { useDisplay } from "vuetify";
  import ExploreFeed from "./ExploreFeed.vue";
  import { screenMode } from "~/hooks/useScreenMode";

  const props = defineProps({
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLoadMore: {
      type: Boolean,
      default: false,
    },
    isNoMore: {
      type: Boolean,
      default: false,
    },
    scrollContainer: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
  });

  const emits = defineEmits(["get-more", "click-item", "before-update"]);

  const feedsContainer = ref<HTMLElement | null>(null);
  const { lg, md, smAndDown } = useDisplay();

  // Masonry layout properties
  const minColumns = computed(() => {
    if (smAndDown.value) return 2;
    if (screenMode.value == "pad") return 3;
    if (lg.value || md.value) return 4;
    return 5;
  });
  const gap = computed(() => (screenMode.value === "phone" ? 12 : 28));
  const internalGap = ref(gap.value);
  watch(gap, (newGap) => {
    internalGap.value = newGap;
  });

  const updateColumnWidth = () => {
    // This function can be defined here or imported if it's complex
  };

  const handleItemClick = (item: any) => {
    emits("click-item", item);
  };
  onMounted(() => {
    nextTick(() => updateColumnWidth());
    window.addEventListener("resize", updateColumnWidth);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateColumnWidth);
  });

  // When component is re-activated from keep-alive, redraw the masonry
  onActivated(() => {
    // Force a redraw by temporarily changing a reactive prop (gap)
    // and then changing it back. This triggers the internal watcher.
    internalGap.value = gap.value + 1;
    nextTick(() => {
      internalGap.value = gap.value;
    });
  });

  defineExpose({ element: feedsContainer });
</script>

<template>
  <div
    class="feeds-container"
    ref="feedsContainer"
  >
    <MasonryWall
      v-show="items?.length > 0"
      ref="masonryRef"
      :items="items ?? []"
      :min-columns="minColumns"
      :gap="internalGap"
      :scroll-container="scrollContainer ?? feedsContainer"
      item-key="id"
    >
      <template #default="{ item, index }">
        <ExploreFeed
          :feed="item"
          @click="handleItemClick(item)"
        />
      </template>
    </MasonryWall>
    <!-- Loading indicator for loading more -->
    <ExploreLoading
      :loading="isLoadMore"
      class="pb-16"
    />
    <!-- Loading indicator for loading more -->

    <div
      v-if="isNoMore"
      class="flex justify-center text-xl py-2"
    >
      <v-empty-state
        headline="不再"
        text="请稍后再查看更多数据!"
        title="没有更多数据显示"
      />
    </div>
  </div>
</template>

<style scoped>
  .feeds-container {
    width: 100%;
    flex-grow: 1; /* Allow container to fill available space */
    overflow-y: auto;
    scrollbar-width: none;
  }
</style>
