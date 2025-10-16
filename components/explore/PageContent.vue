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
  import { useDisplay } from "vuetify";

  const noteDialog = useNoteDialog();
  const feeds = ref<ExploreFeedInfo[]>([]);
  const isLoadMore = ref(false);
  const isNoMore = ref(false);
  const { clearQuery, route, store, storeUser, debounce } = useVariable();
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const { generateVisitCode } = useHome();
  const page = ref(Number(route.params.page) || 1);

  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  async function fetchFeeds(pageNum: number) {
    try {
      if (storeUser.visitCode === "") {
        generateVisitCode();
      }
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

    { transform: (data) => data || [] } // SSR-safe
  );

  // Assign only once
  if (initialFeeds.value?.length) {
    feeds.value = initialFeeds.value;
  }

  /* ---------------------------
     3. Infinite Scroll
  ---------------------------- */
  const onLoadMore = async () => {
    if (pending.value || isNoMore.value || isLoadMore.value) return;
    isLoadMore.value = true;
    const container = exploreContainerRef.value?.element;
    const isWindowScroll =
      !container || container.scrollHeight <= container.clientHeight;
    const lastScrollTop = isWindowScroll
      ? window.scrollY
      : (container?.scrollTop ?? 0);
    try {
      page.value++;
      const newFeeds = await fetchFeeds(page.value);
      if (Array.isArray(newFeeds) && newFeeds.length > 0) {
        // ✅ Reassign feeds while keeping previous scroll
        feeds.value = [...feeds.value, ...newFeeds];
        await nextTick();
        // Smooth scroll restoration
        requestAnimationFrame(() => {
          if (isWindowScroll) {
            window.scrollTo({ top: lastScrollTop, behavior: "auto" });
          } else if (container) {
            container.scrollTop = lastScrollTop;
          }
        });
      } else {
        isNoMore.value = true;
      }
    } catch (err) {
      console.error("Failed to load more feeds:", err);
      // Optional: show user feedback
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

  const { reset } = useInfiniteScroll(
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
  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    return isNative.value || smAndDown.value ? "250px" : "170px";
  });
</script>

<template>
  <div class="explore-wrapper">
    <!-- <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
    /> -->

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
    height: calc(100dvh - v-bind(heightOffset));
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    scrollbar-width: none;
  }
</style>
