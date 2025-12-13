<script setup lang="ts">
  import { getConfig, findList } from "~/service/hookup";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useNoteHookupDialog } from "~/hooks/useNoteHookupDialog";
  import { checkPermissions } from "~/hooks/usePermisions";
  import { PERMISSION } from "~/common/permision";

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
    isCheckpoint: false,
  });
  const { setScrollableElement, scrollTop } = useScrollManager();
  const { store, clearQuery, isMobile } = useVariable();
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
  const heightOffset = computed(() => {
    if (isMobile.value) {
      return "240px";
    }
    return "190px";
  });
  const onOpenCheckPoint = () => {
    checkPermissions(PERMISSION.User, () => {
      state.isCheckpoint = true;
    });
  };
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
    useInfiniteScroll(containerRef, onLoadMore, {
      distance: 300,
      canLoadMore: () => !state.loadmore && !state.isNoMore,
    });
  });
</script>

<template>
  <v-container
    fluid
    class="pa-0 h-100"
    color="none"
  >
    <v-card
      flat
      color="transparent"
      :loading="state.loading"
    >
      <v-card-title class="px-0 pt-0">
        <v-toolbar
          color="surface"
          density="compact"
        >
          <v-row
            dense
            align="center"
          >
            <v-col cols="4">
              <v-btn
                variant="text"
                @click="state.isDrawerOpen = true"
                class="px-2 ml-0 ml-md-2"
              >
                <div class="d-flex align-center ga-2">
                  <v-icon size="24">mdi-map-marker</v-icon>
                  <span class="text-body-1">地点</span>
                </div>
              </v-btn>
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
          class="category-tabs px-md-2"
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
      </v-card-title>

      <v-card-text class="px-0 pb-0 position-relative">
        <!-- Tabs -->
        <div
          ref="containerRef"
          class="hookup-wrapper"
        >
          <!-- <ExploreContainer
          ref="exploreContainerRef"
          :items="state.data"
          :is-load-more="state.loadmore"
          :is-no-more="state.isNoMore"
          @click-item="openDialog"
        /> -->
          <v-row
            :dense="isMobile"
            class="w-100 px-2"
          >
            <v-col
              v-for="(item, index) in state.data"
              :key="index"
              cols="6"
              sm="4"
              md="3"
              class="col-lg-1-5"
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
                  min-height="200px"
                  :aspect-ratio="(180 / 280) * 1.5"
                  cover
                />
                <div class="pa-2">
                  <div class="text-surface-variant my-1">
                    {{ item?.name }}
                  </div>
                  <div>
                    最低消费:
                    <strong class="text-primary">
                      {{ item?.min_price }} 元
                    </strong>
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
        <div
          class="position-absolute point-bg"
          style="right: 5px; bottom: 30vh"
          @click="onOpenCheckPoint"
        >
          <div
            class="px-2 py-3 d-flex flex-column text-white font-weight-bold f12"
          >
            <div>签到免</div>
            <div>定金</div>
          </div>
        </div>
      </v-card-text>
    </v-card>
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
    <HookupCheckPointDialog v-model="state.isCheckpoint" />
  </v-container>
</template>

<style scoped lang="scss">
  .hookup-wrapper {
    width: 100%;
    max-height: calc(100vh - v-bind(heightOffset));
    overflow-y: auto;
    scrollbar-width: none;
    padding-bottom: 40px;
  }
  .custom-tab {
    min-width: 45px !important;
    margin-right: 10px;
  }
  .category-tabs :deep(.v-slide-group__next),
  .category-tabs :deep(.v-slide-group__prev) {
    min-width: 36px;
  }
  .point-bg {
    background-image: url("/hookgirl/hookicon.png"); /* ✅ Nuxt will serve from /hookicon.png */
    width: 60px;
    border-radius: 10px;
    // height: 100px;
    background-color: #8745c4;
    background-size: cover; /* or contain, depending what you want */
    // background-position: right;
    background-repeat: no-repeat;
    cursor: pointer;
  }
</style>
