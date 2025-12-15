<script setup lang="ts">
  import { getCurrentDomain } from "~/service";
  import type { ExploreFeedInfo } from "@/types/info";
  import { like, getExploreFeeds, search } from "@/service/explore";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { openPage } from "~/service";
  import { itemAdClick } from "@/service/advert";
  import useVariable from "@/composables/useVariable";

  const noteDialog = useNoteDialog();
  const feeds = ref<ExploreFeedInfo[]>([]);
  const isLoadMore = ref(false);
  const isNoMore = ref(false);
  const { clearQuery, route, store, storeUser, debounce, isMobile } =
    useVariable();
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const page = ref(Number(route.params.page) || 1);
  const { setScrollableElement, scrollTop } = useScrollManager();

  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  async function fetchFeeds(pageNum: number) {
    try {
      const request = {
        visitor: storeUser.visitCode,
        page: pageNum,
        limit: 30,
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
    `explore-feed-${page.value}`,
    () => fetchFeeds(page.value),
    {
      transform: (data) => data || [],
    } // SSR-safe
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
        like({
          id: item.id,
        }).then((res) => {
          if (res.code !== 200) return;
          item.isLiked = !item.isLiked;
          item.likeCount += item.isLiked ? 1 : -1;
        });
      });
    },
    clickAuthor(item: ExploreFeedInfo) {
      openPage(`${getCurrentDomain()}/#/user/${item.id}`);
    },
  };

  const searchParam = async () => {
    if (store.search === "" || !store.search) return;
    try {
      const respnse = await search({
        keyword: store.search,
      });
      const data = respnse.data;
      feeds.value = data ?? [];
    } catch (e) {
      console.log(e);
    }
  };
  const debouncedSearch = debounce(searchParam, 500);
  watch(
    () => store.search,
    async (v, oldValue) => {
      if (v && route.path == "/") {
        debouncedSearch();
      } else if (!v && route.path == "/" && oldValue) {
        page.value = 1;
        isNoMore.value = false;
        feeds.value = await fetchFeeds(1);
      }
    }
  );
  const heightOffset = computed(() => {
    if (isMobile.value) {
      return "200px";
    }
    return "160px";
  });

  onMounted(() => {
    const el = exploreContainerRef.value?.element;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
    let isInitualized = false;
    useInfiniteScroll(
      () => exploreContainerRef.value?.element,
      () => {
        // load more
        if (!isInitualized) {
          isInitualized = true;
          return;
        }
        onLoadMore();
      },
      {
        distance: 300,
        canLoadMore: () => !isLoadMore.value && !isNoMore.value,
      }
    );
  });
</script>

<template>
  <div class="explore-wrapper">
    <ExploreContainer
      ref="exploreContainerRef"
      :items="feeds"
      :is-load-more="isLoadMore"
      :is-no-more="isNoMore"
      @click-item="handle.clickFeed"
    />
    <!-- The loading indicator is now inside ExploreContainer -->
  </div>
</template>

<style scoped lang="scss">
  .explore-wrapper {
    width: 100%; /* Default height for desktop */
    max-height: calc(100vh - v-bind(heightOffset));
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    scrollbar-width: none;
  }
</style>
