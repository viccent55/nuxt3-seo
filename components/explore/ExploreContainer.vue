<script setup lang="ts">
  import ExploreFeed from "./ExploreFeed.vue";
  import { useDisplay } from "vuetify";
  import {
    computed,
    onActivated,
    nextTick,
    onMounted,
    onUnmounted,
    watch,
    ref,
    type PropType,
  } from "vue";

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
  });

  const emits = defineEmits(["get-more", "click-item", "before-update"]);

  const feedsContainer = ref<HTMLElement | null>(null);
  const masonryRef = ref<any>(null);

  const { mobile } = useDisplay();

  // Masonry layout properties
  const columnWidth = computed(() => (mobile.value ? 160 : 230));
  const minColumns = computed(() => (mobile.value ? 2 : 5));
  const gap = computed(() => (mobile.value ? 12 : 28));
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

  onActivated(() => {
    // When the component is re-activated from keep-alive,
    // force the masonry wall to redraw itself.
    console.log(masonryRef.value);
  });

  watch(
    () => props.items,
    () => console.log(masonryRef.value)
  );
  defineExpose({ element: feedsContainer });
</script>

<template>
  <div
    class="feeds-container"
    ref="feedsContainer"
  >
    <MasonryWall
      ref="masonryRef"
      :items="items ?? []"
      :column-width="columnWidth"
      :min-columns="minColumns"
      :ssr-columns="4"
      :gap="gap"
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
      class="pb-8"
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
