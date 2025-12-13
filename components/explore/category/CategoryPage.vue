<script setup lang="ts">
  import type { ExploreFeedInfo } from "@/types/info";
  import { like, getExploreFeeds } from "@/service/explore";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { itemAdClick } from "@/service/advert";
  import useVariable from "@/composables/useVariable";
  import { ref } from "vue";

  const noteDialog = useNoteDialog();
  const feeds = ref<ExploreFeedInfo[]>([]);
  const isLoadMore = ref(false);
  const isNoMore = ref(false);
  const { clearQuery, route, store, storeUser } = useVariable();
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const page = ref(Number(route.params.page) || 1);
  const { setScrollableElement, scrollTop } = useScrollManager();

  /* ---------------------------
   1. Centralized fetch function
---------------------------- */
  const cat_id = computed(() => route.params.id);
  async function fetchFeeds(pageNum: number) {
    try {
      const request = {
        visitor: storeUser.visitCode,
        page: pageNum,
        limit: 30,
        category: cat_id.value,
      };
      const response = await getExploreFeeds(request);
      return response.data || [];
    } catch (err) {
      console.error("fetchFeeds failed:", err);
      isNoMore.value = true;
      return [];
    }
  }

  /* ---------------------------
   2. Initial SSR fetch
---------------------------- */

  const { data: initialFeeds, pending } = await useAsyncData(
    `explore-cat-${cat_id.value}`,
    () => fetchFeeds(page.value),
    { transform: (data) => data || [] } // SSR-safe
  );

  // Assign only once
  if (initialFeeds.value?.length) {
    feeds.value = [];
    feeds.value = initialFeeds.value;
  }

  /* ---------------------------
   3. Infinite Scroll
---------------------------- */
  const onLoadMore = async () => {
    if (pending.value || isNoMore.value) return;
    isLoadMore.value = true;
    page.value++;
    try {
      const newFeeds = await fetchFeeds(page.value);
      if (newFeeds?.length) {
        feeds.value = [...feeds.value, ...newFeeds];
        await nextTick(); // wait for DOM to update
      } else {
        isNoMore.value = true;
      }
    } catch (error) {
      console.error("Error loading more feeds:", error);
    } finally {
      isLoadMore.value = false;
    }
  };

  /* ---------------------------
   4. Click handlers
---------------------------- */
  const handle = {
    clickFeed(item: ExploreFeedInfo) {
      if (item.mode === 3) itemAdClick(item.id);
      else {
        clearQuery();
        noteDialog.openNoteDialog(item.id);
      }
    },
    clickLike(item: ExploreFeedInfo) {
      checkPermissions(PERMISSION.User, () => {
        like({ id: item.id }).then((res) => {
          if (res.code !== 200) return;
          item.isLiked = !item.isLiked;
          item.likeCount += item.isLiked ? 1 : -1;
        });
      });
    },
  };

  useInfiniteScroll(
    () => exploreContainerRef.value?.element,
    () => {
      // load more
      onLoadMore();
    },
    {
      distance: 300,
      canLoadMore: () => !isLoadMore.value && !isNoMore.value,
    }
  );
  onMounted(() => {
    const el = exploreContainerRef.value?.element;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
  });
</script>

<template>
  <ExploreContainer
    ref="exploreContainerRef"
    :items="feeds"
    :is-load-more="isLoadMore"
    :is-no-more="isNoMore"
    @click-item="handle.clickFeed"
  />
</template>
<style scoped lang="scss"></style>
