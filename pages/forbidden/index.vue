<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });
  import { useInfiniteScroll } from "@vueuse/core";
  import useVariable from "@/composables/useVariable";
  import { useNoteForbidden } from "~/hooks/useNoteForbiddenDialog";
  import { useDisplay } from "vuetify";
  import { select, getCategories } from "@/service/forbidden";

  const state = reactive({
    data: [] as EmptyArrayType,
    page: 1,
    limit: 30,
    isNomore: false,
    loadmore: false,
    total: 0,
    cid: null as number | null,
    categories: [] as EmptyArrayType,
    loading: false,
    keyword: "",
    statusCode: null as number | null,
  });

  const { clearQuery, store, storeUser, formatDate, route } = useVariable();
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  const pageWrapperRef = ref<HTMLElement | null>(null);
  const { setScrollableElement, scrollTop } = useScrollManager();

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

  const displayMenu = computed(() => {
    return [...[{ id: null, name: "全部" }], ...(state.categories || [])];
  });
  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  const fetchData = async (isNewCategory = false) => {
    if (isNewCategory) {
      state.page = 1;
      state.data = [];
      state.isNomore = false;
    }
    state.loading = true;
    try {
      const request: EmptyObjectType = {
        page: state.page,
        limit: state.limit,
        keyword: state.keyword,
      };
      if (state.cid && state.cid != 0) {
        request.cid = state.cid;
      }
      const response: EmptyObjectType = await select(request);
      state.total = response?.data?.count || 0;
      state.statusCode = response?.errcode;
      const newItems = response.data.items.map((item: EmptyObjectType) => {
        return {
          ...item,
          author: { name: formatDate(item.created_at) },
        };
      });

      if (newItems?.length > 0) {
        if (state.page == 1) {
          state.data = newItems;
        } else {
          state.data = [...state.data, ...newItems];
        }
      } else {
        state.isNomore = true;
      }
    } finally {
      state.loading = false;
      state.loadmore = false;
    }
  };

  // Initial data fetch
  // await fetchData(true);
  if (storeUser.isLogin) {
    await fetchData(true);
  }

  const onLoadMore = async () => {
    if (state.loading || state.isNomore || state.data.length >= state.total)
      return;
    state.loadmore = true;
    state.page++;
    await fetchData();
  };

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
        return "200px";
      } else {
        return "150px";
      }
    }
    return "240px";
  });
  const isVisible = ref(
    !storeUser.isLogin || (storeUser.userInfo?.invite_count ?? 0) < 5
  );

  const { configuration } = storeToRefs(store);

  useSeo(
    computed(() => configuration.value?.forbidden_title),
    computed(() => configuration.value?.forbidden_description),
    computed(() => configuration.value?.forbidden_keywords)
  );

  watch(
    () => state.statusCode,
    (newCode) => {
      if (newCode === 403) isVisible.value = true;
    }
  );

  onMounted(() => {
    const el = exploreContainerRef.value?.element;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
    // -------------------- Infinite Scroll --------------------
    useInfiniteScroll(
      pageWrapperRef,
      () => {
        onLoadMore();
      },
      {
        distance: 300,
        canLoadMore: () => !state.loadmore && !state.isNomore,
      }
    );
  });
</script>

<template>
  <v-container
    class="pa-0 d-flex flex-column"
    fluid
    style="height: 100%"
  >
    <!-- Tabs fixed / sticky -->
    <v-card
      flat
      color="transparent"
    >
      <v-card-title>
        <v-tabs
          v-model="state.cid"
          color="primary"
          class="category-tabs flex-shrink-0"
          density="compact"
          show-arrows
          @update:model-value="fetchData(true)"
        >
          <v-tab
            v-for="(item, index) in displayMenu"
            :key="index"
            :value="item.id"
            class="px-0 custom-tab"
          >
            {{ item?.name }}
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text class="pa-0 px-md-3">
        <!-- Wrapper for content and overlay -->
        <div
          class="forbidden-wrapper"
          ref="pageWrapperRef"
        >
          <div
            v-if="!state.data?.length && !isVisible && state.loading == false"
            class="text-center"
          >
            <v-btn
              @click="fetchData(true)"
              color="primary"
              rounded="xl"
              prepend-icon="mdi-refresh"
            >
              刷新
            </v-btn>
          </div>
          <ExploreContainer
            ref="exploreContainerRef"
            :items="state.data"
            :is-load-more="state.loading"
            :is-no-more="state.isNomore"
            @click-item="clickFeed"
          />
        </div>

        <v-overlay
          v-model="isVisible"
          contained
          :opacity="0.95"
        />
      </v-card-text>
    </v-card>
    <ForbiddenRuleDialog v-model:model-value="isVisible" />
  </v-container>
</template>

<style scoped lang="scss">
  .contain-height {
    min-height: 80vh;
  }
  .forbidden-wrapper {
    width: 100%;
    max-height: calc(100vh - v-bind(heightOffset));
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 12px;
    position: relative;
    min-height: 70vh;
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
