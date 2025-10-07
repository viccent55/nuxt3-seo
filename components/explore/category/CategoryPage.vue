<script setup lang="ts">
  import { getCurrentDomain } from "~/service";
  import type { ExploreFeedInfo } from "@/types/info";
  import { like } from "@/service/explore";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { openPage } from "~/service";
  import { useUserStore } from "@/store/user";
  import { useStore } from "@/store/index";
  import { storeToRefs } from "pinia";
  import { itemAdClick } from "@/service/advert";
  import useVariable from "@/composables/useVariable";
  import { ref } from "vue";

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
        category: Number(route.params.cid),
      };
      console.log(request);
      const response = await $fetch<EmptyObjectType>("/api/explore/feed", {
        method: "POST",
        body: dataEncrypt(request),
      });
      const result = decrypt(response.data);
      if (result?.errcode === 0 && Array.isArray(result.data)) {
        return result.data;
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
    `explore-cat-${page.value}`,
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
    page.value++;

    isLoadMore.value = true;
    const newFeeds = await fetchFeeds(page.value);

    if (newFeeds?.length) {
      feeds.value = [...feeds.value, ...newFeeds];
      // Wait for the DOM to update with the new items
      await nextTick();
    } else {
      isNoMore.value = true;
    }
    isLoadMore.value = false;
  };

  /* ---------------------------
   4. Click handlers
---------------------------- */
  const handle = {
    clickChannel(item: Record<string, string>) {
      if (item.value === store.channel) return;

      indexChannel.value = item.value;
      store.channel = item.value;
      store.mode = "0";
      page.value = 1;
      isNoMore.value = false;

      // Use a separate state for loading to avoid clearing the existing feeds
      const { data: newFeeds, pending } = useAsyncData(
        `explore-feed-${item.value}`,
        () => fetchFeeds(1)
      );

      // Watch for the new data to arrive, then update the feeds
      watch(newFeeds, (result) => (feeds.value = result || []), { once: true });
    },
    clickFeed(item: ExploreFeedInfo) {
      if (item.mode === 3) itemAdClick(item.id);
      else {
        clearQuery();
        noteDialog.openNoteDialog(String(item.id));
      }
    },
    clickLike(item: ExploreFeedInfo) {
      checkPermissions(PERMISSION.User, () => {
        like(item.id).then((res) => {
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
</script>

<template>
  <div class="explore-wrapper">
    <h1 class="d-none">小红书成人版-记录性福每一天</h1>
    <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
    />
    <ExploreContainer
      ref="exploreContainerRef"
      :items="feeds"
      :is-load-more="isLoadMore"
      :is-no-more="isNoMore"
      @click-item="handle.clickFeed"
    />
  </div>
</template>

<style scoped>
  .explore-wrapper {
    width: 100%;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    padding: 0 24px;
  }
</style>
