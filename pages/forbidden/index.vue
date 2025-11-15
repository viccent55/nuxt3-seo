<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });
  import { useInfiniteScroll } from "@vueuse/core";
  import useVariable from "@/composables/useVariable";
  import { useNoteForbidden } from "~/hooks/useNoteForbiddenDialog";
  import { useDisplay } from "vuetify";
  const { setScrollableElement, scrollTop } = useScrollManager();
  import { select, getCategories } from "@/service/forbidden";

  const state = reactive({
    data: [] as EmptyArrayType,
    page: 1,
    limit: 30,
    isNoMore: false,
    loadmore: false,
    total: 0,
    cid: 0,
    categories: [] as EmptyArrayType,
    loading: false,
  });

  const { clearQuery, store, storeUser, formatDate } = useVariable();
  const containerRef = ref<HTMLElement | null>(null);

  const getAllCategories = async () => {
    state.loading = true;
    try {
      const response: EmptyObjectType = await getCategories();
      state.categories = response.data ?? [];
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  await getAllCategories();
  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  const fetchData = async (isNewCategory = false) => {
    if (isNewCategory) {
      state.page = 1;
      state.data = [];
      state.isNoMore = false;
    }

    try {
      state.loading = true;
      const request = {
        cid: state.cid,
        page: state.page,
        limit: state.limit,
      };
      const response: EmptyObjectType = await select(request);
      state.total = response?.data?.count || 0;
      const newItems = response?.data.map((item: EmptyObjectType) => {
        return {
          ...item,
          author: { name: formatDate(item.created_at) },
        };
      });

      if (newItems.length > 0) {
        state.data = newItems;
      } else {
        state.isNoMore = true;
      }
    } catch (err) {
      console.error("fetchData failed:", err);
      state.isNoMore = true;
    } finally {
      state.loading = false;
    }
  };

  // Initial data fetch
  await fetchData(true);

  const onLoadMore = async () => {
    if (state.loading || state.isNoMore || state.data.length >= state.total)
      return;
    state.loadmore = true;
    state.page++;
    await fetchData();
  };
  useInfiniteScroll(containerRef, onLoadMore, {
    distance: 300,
    canLoadMore: () => !state.loadmore && !state.isNoMore,
  });
  const noteDialog = useNoteForbidden();
  const clickFeed = (item: EmptyObjectType) => {
    clearQuery();
    noteDialog.openNoteDialog(item.id);
  };

  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    if (!isNative.value) {
      if (smAndDown.value) {
        return "190px";
      } else {
        return "150px";
      }
    }
    return "240px";
  });
  const isVisible = ref(false);
  const displayMenu = computed(() => {
    return [...[{ id: 0, name: "全部" }], ...(state.categories || [])];
  });
  if (displayMenu.value?.length) {
    state.cid = displayMenu.value[0]?.id ?? 0;
  }
  const { configuration } = storeToRefs(store);
  useSeo(
    computed(() => configuration.value?.cartoon_title),
    computed(() => configuration.value?.cartoon_description),
    computed(() => configuration.value?.cartoon_keywords)
  );
  onBeforeMount(() => {
    if (storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin)
      isVisible.value = true;
  });
  onMounted(() => {
    const el = containerRef.value;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
  });
</script>

<template>
  <v-container
    class="pa-0 d-flex flex-column"
    fluid
    style="height: 100%"
  >
    <!-- Tabs fixed / sticky -->
    <v-tabs
      v-model="state.cid"
      color="primary"
      class="px-md-4 px-2 category-tabs flex-shrink-0"
      density="compact"
      show-arrows
      @update:model-value="fetchData(true)"
    >
      <v-tab
        v-for="item in displayMenu"
        :key="item"
        :value="item?.id"
        class="px-0 custom-tab"
      >
        {{ item?.name }}
      </v-tab>
    </v-tabs>

    <div
      class="forbidden-wrapper pb-6 mt-2 md:pb-0"
      ref="containerRef"
    >
      <ExploreContainer
        ref="exploreContainerRef"
        :items="state.data"
        :is-load-more="state.loading"
        :is-no-more="state.isNoMore"
        @click-item="clickFeed"
      />
    </div>
    <ForbiddenRuleDialog v-model:model-value="isVisible" />
  </v-container>
</template>

<style scoped lang="scss">
  .forbidden-wrapper {
    width: 100%;
    max-height: calc(100vh - v-bind(heightOffset));
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 12px;
    scrollbar-width: none;
  }

  .news-card {
    width: 100%;
    background-color: transparent;
    overflow: hidden;
    border: none;
    transition: transform 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
    word-break: break-word;
  }

  .custom-tab {
    min-width: 45px !important;
    margin-right: 10px;
  }
  .category-tabs {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .category-tabs :deep(.v-slide-group__next),
  .category-tabs :deep(.v-slide-group__prev) {
    min-width: 32px;
  }
</style>
