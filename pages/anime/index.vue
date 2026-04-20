<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });
  import { useInfiniteScroll } from "@vueuse/core";
  import useVariable from "@/composables/useVariable";
  import { useNoteAnimeDialog } from "~/hooks/useNoteAnimeDialog";
  import { useDisplay } from "vuetify";
  import { openLoginDialog } from "@/hooks/useLoginDialog";
  import {verifyAuth} from "@/service/user"
  const { setScrollableElement, scrollTop } = useScrollManager();

  const state = reactive({
    data: [] as EmptyArrayType,
    page: 1,
    isNoMore: false,
    loadmore: false,
    total: 0,
  });

  const { clearQuery, store, storeUser } = useVariable();
  const containerRef = ref<HTMLElement | null>(null);

  const { configuration } = storeToRefs(store);
  useSeo(
    computed(() => configuration.value?.cartoon_title),
    computed(() => configuration.value?.cartoon_description),
    computed(() => configuration.value?.cartoon_keywords)
  );

  
  /* ---------------------------
     1. Centralized fetch function
  ---------------------------- */
  const fetchData = async () => {
    try {
      const request = {
        page: state.page,
        limit: 30,
      };
      // console.log('✅ ✅。🤣 。。。')
      const response: EmptyObjectType = await useApiFetch("/api/anime/select", {
        method: "POST",
        body: dataEncrypt(request),
      });
      const result = decrypt(response.data);
      // console.log('fetch data :', result);
      state.total = result.data.count;
      if (result?.errcode === 0 && Array.isArray(result.data.items)) {
        return result.data;
      }
      state.isNoMore = true;

      return [];
    } catch (err) {
      console.error("fetchData failed:", err);
      state.isNoMore = true;
      return [];
    }
  };

  /* ---------------------------
     2. Initial SSR fetch
  ---------------------------- */

  const { data, pending } = await useAsyncData(
    `anime-select`,
    () => fetchData(),

    { transform: (data) => data || [] } // SSR-safe
  );

  // Assign only once
  if (data.value?.items) {
    state.total = data.value.counts;
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
      const data = await fetchData();
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
  const noteDialog = useNoteAnimeDialog();
  const openDialog = (id: number) => {
    clearQuery();
    noteDialog.openNoteDialog(id);
  };
  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    if (!isNative.value) {
      if (smAndDown.value) {
        return "140px";
      } else {
        return "100px";
      }
    }
    return "220px";
  });
  const isVisible = ref(true);
  // onBeforeMount(() => {
  //   if (storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin)
  //     isVisible.value = true;
  // });
  onMounted(() => {
    const el = containerRef.value;
    if (el) {
      setScrollableElement(el);
      el.addEventListener("scroll", () => (scrollTop.value = el.scrollTop));
    }
  });
  const showAlert = ref(false)
  const ShowDialog = ref(true)
  const unlockHandler = async () => {
    if(!storeUser.isLogin){
        openLoginDialog()
        return 
    }
    const resp = await verifyAuth(0,'jinqu');
    // console.log('✅ ⚠️ : ',resp)
    if (resp.data){
      // console.log('⚠️ #fdsa....')
      ShowDialog.value = false;
      fetchData()
            // console.log('⚠️ #fdsa....11')
      isVisible.value = false;
            // console.log('#fdsa....22')
      return ;
    }else{
      showAlert.value = true
    }
  }

</script>

<template>
  <v-alert
    v-model="showAlert"
    type="warning"
    title="权限警告"
    text="您没有权限 请联系客服开通权限"
    closable
  ></v-alert>
  <v-container
    class="px-0 pt-5"
    fluid
  >
    <div
      class="anime-wrapper pb-6 md:pb-0"
      ref="containerRef"
    >
      <v-row :dense="smAndDown">
        <v-col
          v-for="(item, index) in state.data"
          :key="index"
          cols="4"
          sm="4"
          md="3"
          lg="3"
          class="d-flex flex-column align-center mb-0 mb-md-2"
        >
          <v-card
            class="news-card"
            @click.prevent="openDialog(item.id)"
            tag="a"
            :to="'/anime/' + item.id"
            flat
          >
            <Image
              :src="item.cover"
              class="rounded-lg"
              :aspect-ratio="400 / 250"
              cover
            />
            <div class="text-surface-variant my-1 text-center">
              {{ item.title }}
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
        v-if="state.data.length >= state.total"
        class="d-flex justify-center align-center text-center py-4"
      >
        <v-empty-state
          icon="mdi-image-off"
          title="没有更多了"
          text="暂无内容"
        />
      </div>
    </div>
    <AnimeRuleDialog v-model:model-value="isVisible"  @select="unlockHandler" />
  </v-container>
</template>

<style scoped lang="scss">
  .anime-wrapper {
    width: 100%;
    max-height: calc(100vh - v-bind(heightOffset));
    height: calc(100dvh - v-bind(heightOffset));
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
</style>
