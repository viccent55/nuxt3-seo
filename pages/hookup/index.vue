<script setup lang="ts">
  import { getConfig, findList } from "~/service/hookup";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useNoteHookupDialog } from "~/hooks/useNoteHookupDialog";
  import { useDisplay } from "vuetify";

  definePageMeta({
    keepalive: true,
  });

  const state = reactive({
    isDrawerOpen: false,
    isFilterOpen: false,
    tab: 0,
    data: [] as EmptyArrayType,
    page: 1,
    limit: 30,
    isNoMore: false,
    loadmore: false,
    total: 0,
    filter: {
      cid: 0,
      province: null as null | string,
      city: null as null | string,
      tag_id: null as null | string,
    },
    loading: false,
  });
  const { setScrollableElement, scrollTop } = useScrollManager();
  const { store, clearQuery } = useVariable();
  const { configuration } = storeToRefs(store);
  const noteDialog = useNoteHookupDialog();
  const containerRef = ref<HTMLElement | null>(null);

  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  const { data: config, pending: configPending } = await useAsyncData(
    "hookup-config",
    () => getConfig({}),
    {
      transform: (data: EmptyObjectType) => data?.data || [],
      default: () => [],
    }
  );

  const fetchData = async () => {
    try {
      state.loading = true;
      const request = {
        page: state.page,
        limit: state.limit,
        ...state.filter,
      };
      const res = await findList(request);
      if (res?.errcode === 0 && Array.isArray(res.data.items)) {
        state.total = res.data.count;
        return res.data;
      }
      state.isNoMore = true;
      return [];
    } catch (err) {
      console.error("fetchData failed:", err);
      state.isNoMore = true;
      return [];
    } finally {
      state.loading = false;
    }
  };

  const { data, pending } = await useAsyncData(
    `hookup-list`,
    () => fetchData(),
    { transform: (data) => data || [] } // SSR-safe
  );

  // Assign only once
  if (data.value?.items) {
    state.total = data.value.count;
    state.data = data.value.items;
  }

  const onLoadMore = async () => {
    if (pending.value || state.loadmore || state.data.length >= state.total)
      return;

    try {
      state.loadmore = true;
      state.page++;
      const data = await fetchData();
      if (data.items.length) {
        state.data.push(...data.items);
      } else {
        state.isNoMore = true;
      }
    } finally {
      state.loadmore = false;
    }
  };

  useInfiniteScroll(containerRef, onLoadMore, {
    distance: 300,
    canLoadMore: () => !state.loadmore && !state.isNoMore,
  });

  const openDialog = (id: number) => {
    clearQuery();
    noteDialog.openNoteDialog(id);
  };

  const resetAndFetch = async () => {
    state.page = 1;
    state.data = [];
    state.isNoMore = false;
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
    }
    scrollTop.value = 0;
    const data = await fetchData();
    if (data.items) {
      state.data = data.items;
    }
  };

  const onDrawerSelect = (item: { province: string | null; city: string }) => {
    state.filter.province = item.province;
    state.filter.city = item.city;
    resetAndFetch();
  };
  const onTagSelect = (tagId: string | null) => {
    state.filter.tag_id = tagId;
    resetAndFetch();
  };
  const displayMenu = computed(() => {
    return [...[{ id: 0, name: "全部" }], ...(config.value?.categories || [])];
  });
  if (displayMenu.value?.length) {
    state.filter.cid = displayMenu.value[0]?.id ?? 0;
  }
  const onChange = () => {
    resetAndFetch();
  };
  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    if (!isNative.value) {
      if (smAndDown.value) {
        return "300px";
      } else {
        return "200px";
      }
    }
    return "220px";
  });
  useSeo(
    computed(() => configuration.value?.novel_title),
    computed(() => configuration.value?.novel_description),
    computed(() => configuration.value?.novel_keywords)
  );
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
    fluid
    class="pa-0"
    color="none"
  >
    <v-toolbar
      color="surface"
      density="comfortable"
    >
      <v-row dense>
        <v-col cols="4">
          <div class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              @click="state.isDrawerOpen = true"
            >
              <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <span class="text-body-1">地点</span>
          </div>
        </v-col>
        <v-col
          cols="4"
          align-self="center"
        >
          <div
            class="d-flex justify-center text-h6 text-primary font-weight-bold"
          >
            精选推荐
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center justify-end">
            <v-btn
              icon
              variant="text"
              @click="state.isFilterOpen = true"
            >
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-tabs
      v-model="state.filter.cid"
      color="primary"
      class="px-md-4 px-0 category-tabs"
      density="compact"
      show-arrows
      @update:model-value="onChange"
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

    <v-card-text class="px-3">
      <!-- Tabs -->
      <div
        class="hookup-wrapper"
        ref="containerRef"
      >
        <!-- <ExploreContainer
          ref="exploreContainerRef"
          :items="state.data"
          :is-load-more="state.loadmore"
          :is-no-more="state.isNoMore"
          @click-item="openDialog"
        /> -->
        <v-row
          :dense="smAndDown"
          class="w-100"
        >
          <v-col
            v-for="(item, index) in state.data"
            :key="index"
            cols="6"
            sm="6"
            md="3"
            lg="3"
          >
            <v-card
              @click.prevent="openDialog(item.id)"
              tag="a"
              :to="'/hookup/' + item.id"
              flat
              class="hookup-card"
              rounded="lg"
            >
              <Image
                :src="item?.cover"
                max-height="200px"
                cover
              />
              <div class="pa-2">
                <div class="text-surface-variant my-1">
                  {{ item?.name }}
                </div>
                <div>
                  最低消费:
                  <strong class="text-primary">{{ item?.min_price }} 元</strong>
                </div>
                <v-chip
                  class="mr-1 mt-1 rounded-lg"
                  v-for="(tag, index) in item?.tags"
                  :key="index"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  {{ tag?.name }}
                </v-chip>
              </div>
            </v-card>
          </v-col>

          <!-- Loading Indicator -->
          <v-col
            cols="12"
            class="text-center"
          >
            <ExploreLoading :loading="state.loadmore" />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div
          v-if="state.data.length >= state.total && state.isNoMore"
          class="d-flex justify-center align-center text-center py-4"
        >
          <v-empty-state
            icon="mdi-image-off"
            title="没有更多了"
            text="暂无内容"
          />
        </div>
      </div>
    </v-card-text>
    <hookup-drawer-area
      :areas="config?.areas"
      :hot-areas="config?.hot_areas"
      v-model="state.isDrawerOpen"
      @select="onDrawerSelect"
    ></hookup-drawer-area>
    <hookup-drawer-filter
      :tags="config?.tags"
      v-model="state.isFilterOpen"
      @select="onTagSelect"
    ></hookup-drawer-filter>
  </v-container>
</template>

<style scoped lang="scss">
  .hookup-wrapper {
    width: 100%;
    max-height: calc(100vh - v-bind(heightOffset));
    overflow-y: auto;
    scrollbar-width: none;
  }
  .custom-tab {
    min-width: 45px !important;
    margin-right: 10px;
  }
  .category-tabs :deep(.v-slide-group__next),
  .category-tabs :deep(.v-slide-group__prev) {
    min-width: 32px;
  }
</style>
