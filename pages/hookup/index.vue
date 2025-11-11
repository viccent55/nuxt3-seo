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
    isNoMore: false,
    loadmore: false,
    total: 0,
    filter: {
      cid: 0,
      province: null as null | string,
      city: null as null | string,
      tag_id: null as null | string,
    },
  });

  const { store, clearQuery } = useVariable();
  const { configuration } = storeToRefs(store);
  const noteDialog = useNoteHookupDialog();
  const containerRef = ref<HTMLElement | null>(null);
  const { smAndDown } = useDisplay();

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
  if (config.value?.categories?.length) {
    state.filter.cid = config.value.categories[0]?.id ?? 0;
  }

  const { data, pending, refresh } = await useAsyncData(
    "hookup-list",
    () =>
      findList({
        page: state.page,
        limit: 30,
        ...state.filter,
      }),
    {
      transform: (data: EmptyObjectType) => data?.data || [],
      default: () => [],
    }
  );
  // Assign only once
  if (data.value?.items) {
    state.total = data.value.items.length;
    state.data = data.value.items;
  }
  let initialized = false;
  const onLoadMore = async () => {
    if (pending.value || state.data.length >= state.total) return;
    if (!initialized) {
      initialized = true;
      return; // skip the first trigger
    }
    try {
      state.loadmore = true;
      state.page++;
      const data = await findList({
        page: state.page,
        limit: 30,
      });
      if (data.items.length) {
        state.data.push(...data.items);
      }
    } finally {
      state.loadmore = false;
    }
  };
  const openDialog = (id: number) => {
    clearQuery();
    noteDialog.openNoteDialog(id);
  };

  useInfiniteScroll(containerRef, onLoadMore, {
    distance: 300,
    canLoadMore: () => !state.loadmore && !state.isNoMore,
  });

  const onDrawerSelect = (item: { province: string | null; city: string }) => {
    state.filter.province = item.province;
    state.filter.city = item.city;
    refresh();
  };
  const onTagSelect = (tagId: string | null) => {
    state.filter.tag_id = tagId;
    refresh();
  };
  useSeo(
    computed(() => configuration.value?.novel_title),
    computed(() => configuration.value?.novel_description),
    computed(() => configuration.value?.novel_keywords)
  );
</script>

<template>
  <v-card
    flat
    class="px-0 px-md-2 py-md-5"
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
      class="px-4"
      density="compact"
      show-arrows
      @update:model-value="refresh()"
    >
      <v-tab
        v-for="item in config?.categories"
        :key="item"
        :value="item?.id"
        class="px-0"
      >
        {{ item?.name }}
      </v-tab>
    </v-tabs>

    <v-card-text>
      <!-- Tabs -->
      <div
        class="hookup-wrapper"
        ref="containerRef"
      >
        <v-row :dense="smAndDown">
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
            >
              <Image
                :src="item?.cover"
                class="rounded-lg"
                :aspect-ratio="400 / 250"
                cover
              />
              <div class="px-2">
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
                  density="compact"
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
  </v-card>
</template>

<style scoped lang="scss">
  ._hook-wrapper {
    width: 100%;
    // max-height: calc(100vh - v-bind(heightOffset));
    // height: calc(100dvh - v-bind(heightOffset));
    overflow-y: auto;
    padding: 0 12px;
    scrollbar-width: none;
  }
  .hookup-card {
    width: 100%;
    overflow: hidden;
    min-height: 200px;
  }
</style>
