<script setup lang="ts">
  import { getCurrentDomain } from "~/service";
  import type { ExploreFeedInfo } from "@/types/info";
  import { like, getExploreFeeds } from "@/service/explore";
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
  const { clearQuery, route, store, storeUser } = useVariable();
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const { generateVisitCode } = useHome();
  const page = ref(Number(route.params.page) || 1);

  const { configuration, channel, mode } = storeToRefs(store);
  const indexChannel = ref<string>(channel.value);
  const categories = computed(() => [
    { name: "发现", value: "001" },
    ...(configuration.value.categories || []).map((item: EmptyObjectType) => ({
      name: item.name,
      value: item.id,
    })),
  ]);
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
      if (response?.errcode === 0 && Array.isArray(response.data)) {
        return response.data;
      }
      isNoMore.value = true;
      return [];
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
    `explore-feed`,
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
    if (pending.value || isNoMore.value) return;
    isLoadMore.value = true;
    try {
      page.value++;
      const newFeeds = await fetchFeeds(page.value);
      if (newFeeds.length) {
        feeds.value = [...feeds.value, ...newFeeds];
        await nextTick(); // wait for DOM update
      } else {
        isNoMore.value = true;
      }
    } catch (error) {
      console.error("Failed to load more feeds:", error);
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

  useInfiniteScroll(
    () => exploreContainerRef.value?.element,
    () => {
      // load more
      if (!pending.value) {
        onLoadMore();
      }
    },
    {
      distance: 300,
      canLoadMore: () => !isLoadMore.value && !isNoMore.value,
    }
  );
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

<style scoped lang="scss"></style>
