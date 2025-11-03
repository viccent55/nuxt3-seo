<script setup lang="ts">
  import { getNoteFeeds, getStarFeeds, getLikeFeeds } from "@/service/user";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { useInfiniteScroll } from "@vueuse/core";

  const { route, isMobile } = useVariable();
  const noteDialog = useNoteDialog();

  const state = reactive({
    isOpen: false,
    data: [] as EmptyArrayType[],
    qrcodeUrl: "",
    loading: false,
    isNomore: false,
    isLoadmore: false,
    page: 1,
    limit: 30,
    currentType: "note",
  });

  const id = computed(() => Number(route.params.id));
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const pageWrapperRef = ref<HTMLElement | null>(null);
  const { setScrollableElement, scrollTop } = useScrollManager();

  // 🚧 NEW FLAG to control scroll activation
  const infiniteActive = ref(false);

  // -------------------- Data Loaders --------------------
  const getRes = {
    noteFeeds: async () => {
      const request = {
        id: id.value,
        page: state.page,
        limit: state.limit,
      };
      const res = await getNoteFeeds(request);
      if (res.errcode === 0 && res.data) {
        state.data = [...state.data, ...res.data];
        if (!res.data.length) state.isNomore = true;
      }
    },
    starFeeds: async () => {
      const res = await getStarFeeds({ id: id.value, page: state.page });
      if (res.errcode === 0 && res.data) {
        state.data = [...state.data, ...res.data];
        if (!res.data.length) state.isNomore = true;
      }
    },
    likeFeeds: async () => {
      const res = await getLikeFeeds({ id: id.value, page: state.page });
      if (res.errcode === 0 && res.data) {
        console.log(res);
        state.data = [...state.data, ...res.data];
        if (!res.data.length) state.isNomore = true;
      }
    },
  };

  // -------------------- Handlers --------------------
  const handle = {
    clickFeed(feed: any) {
      noteDialog.openNoteDialog(feed.id);
    },
  };

  const onLoadMore = async () => {
    if (
      !infiniteActive.value || // 🧩 prevent early trigger
      state.loading ||
      state.isLoadmore ||
      state.isNomore
    )
      return;

    state.isLoadmore = true;
    state.page++;

    try {
      switch (state.currentType) {
        case "note":
          await getRes.noteFeeds();
          break;
        case "star":
          await getRes.starFeeds();
          break;
        case "like":
          await getRes.likeFeeds();
          break;
      }
    } finally {
      state.isLoadmore = false;
    }
  };
  let isInitualized = false;
  // -------------------- Infinite Scroll --------------------
  const { reset } = useInfiniteScroll(
    pageWrapperRef,
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
      canLoadMore: () => !state.isLoadmore && !state.isNomore,
    }
  );
  onMounted(() => {
    const el = exploreContainerRef.value?.element;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
  });
  // -------------------- Public Method --------------------
  defineExpose({
    open: async (item: EmptyObjectType) => {
      state.data = [];
      state.page = 1;
      state.isNomore = false;
      state.isLoadmore = false;
      state.currentType = item.value;
      state.isOpen = true;

      infiniteActive.value = false; // 🚫 disable until data loaded

      // Initial Load
      if (item.value === "note") await getRes.noteFeeds();
      if (item.value === "star") await getRes.starFeeds();
      if (item.value === "like") await getRes.likeFeeds();

      // ✅ enable infinite scroll only after first load
      nextTick(() => {
        infiniteActive.value = true;
      });
    },
  });
</script>

<template>
  <!-- QR Code Dialog -->
  <v-dialog
    v-model="state.isOpen"
    scrollable
    :fullscreen="isMobile"
    max-width="1200"
  >
    <v-card>
      <v-card-title class="pb-0">
        <v-btn
          icon="mdi-chevron-left"
          flat
          density="comfortable"
          @click="state.isOpen = false"
          style="position: absolute; top: 10px; left: 10px"
        >
          <v-icon size="24px"></v-icon>
        </v-btn>
        <!-- Title -->
        <div class="text-center text-grey-lighten-1 mb-2">我的推广码</div>
      </v-card-title>

      <v-card-text class="px-4 pt-0">
        <div
          class="page-wrapper"
          ref="pageWrapperRef"
        >
          <ExploreContainer
            ref="exploreContainerRef"
            :items="state.data"
            :is-load-more="state.isLoadmore"
            :is-no-more="state.isNomore"
            :scroll-container="pageWrapperRef"
            @click-item="handle.clickFeed"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
  .page-wrapper {
    position: relative;
    width: 100%;

    max-height: calc(100vh - 100px);
    overflow-y: auto;
    scrollbar-width: none;
  }
</style>
