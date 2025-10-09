<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });

  import { useInfiniteScroll } from "@vueuse/core";
  import useVariable from "@/composables/useVariable";
  import ExploreLoading from "@/components/ExploreLoading.vue";
  import { useNoteArticleDialog } from "~/hooks/useNoteArticleDialog";

  const state = reactive({
    data: [] as EmptyArrayType,
    page: 1,
    isNoMore: false,
    loadmore: false,
    total: 0,
  });

  const { clearQuery } = useVariable();
  //   const noteDialog = useNoteArticleDialog();
  const containerRef = ref<HTMLElement | null>(null);

  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  const fetchArticle = async () => {
    try {
      const request = {
        page: state.page,
        limit: 30,
      };
      const response = await $fetch<EmptyObjectType>("/api/article/select", {
        method: "POST",
        body: dataEncrypt(request),
      });
      const result = decrypt(response.data);
      state.total = result.data.count;
      if (result?.errcode === 0 && Array.isArray(result.data.items)) {
        return result.data;
      }
      state.isNoMore = true;

      return [];
    } catch (err) {
      console.error("fetchArticle failed:", err);
      state.isNoMore = true;
      return [];
    }
  };

  /* ---------------------------
     2. Initial SSR fetch
  ---------------------------- */

  const { data, pending } = await useAsyncData(
    `article-select`,
    () => fetchArticle(),

    { transform: (data) => data || [] } // SSR-safe
  );

  // Assign only once
  if (data.value?.items) {
    state.total = data.value.count;
    state.data = data.value.items;
  }

  const onLoadMore = async () => {
    if (pending.value || state.data.length >= state.total) return;
    try {
      state.loadmore = true;
      state.page++;
      const data = await fetchArticle();
      if (data.items.length) {
        state.data.push(...data.items);
      }
    } finally {
      state.loadmore = false;
    }
  };

  useInfiniteScroll(containerRef, onLoadMore, {
    distance: 300,
    canLoadMore: () => !state.loadmore && !state.isNoMore,
  });
  const noteDialog = useNoteArticleDialog();
  const openDialog = (id: number) => {
    clearQuery();
    noteDialog.openNoteDialog(id);
  };
</script>

<template>
  <div
    class="article-wrapper pb-6 md:pb-0"
    ref="containerRef"
  >
    <v-container fluid>
      <v-row :no-gutters="$vuetify.display.mobile">
        <!-- Each Article Card -->
        <v-col
          v-for="(item, index) in state.data"
          :key="index"
          cols="12"
          md="6"
        >
          <v-card
            flat
            class="my-2 md:my-4 article-card"
            @click="openDialog(item.id)"
            tag="a"
          >
            <Image
              :src="item.cover"
              :height="$vuetify.display.mobile ? '160' : '260'"
              cover
              class="rounded-lg"
            >
              <!-- Optional image loading placeholder -->
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </Image>

            <v-card-text
              class="text-center pb-md-2 pb-0 pt-2 font-weight-medium text-md-subtitle-1 text-subtitle-2"
            >
              {{ item.title }}
            </v-card-text>
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
        v-if="state.data.length >= state.total"
        class="flex justify-center py-8"
      >
        <v-empty-state
          headline="没有更多了"
          text="请稍后再查看!"
          icon="mdi-folder-open"
        />
      </div>
    </v-container>
  </div>
</template>

<style scoped>
  .article-wrapper {
    width: 100%;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    padding: 0 12px;
    scrollbar-width: none;
  }

  .article-card {
    border: none;
    transition: transform 0.2s ease;
    background-color: transparent;
  }
  .article-card:hover {
    transform: translateY(-2px);
  }
</style>
