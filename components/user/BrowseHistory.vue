<script lang="ts" setup>
  import { getHistories } from "@/service/user";

  const state = reactive({
    logs: [],
    data: [],
    config: {
      page: 1,
      limit: 30,
      visitor: "",
      content_type: 1,
      content_id: 123,
      platform: 1,
      start_time: "",
      end_time: "",
      keyword: "",
    },
    total: 0,
    loading: false,
    loadingMore: false,
    hasMore: true,
  });
  const { storeUser } = useVariable();

  const getHistoriesList = async () => {
    try {
      state.loading = true;
      const request = {
        page: state.config.page,
        limit: state.config.limit,
        visitor: storeUser.visitCode,
      };
      const res = await getHistories(request);
      console.log('history', res);
      state.data = res.data ?? [];
      //   state.total = res.data.total;
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  const loadMore = async () => {
    try {
    } catch (e) {
      console.log(e);
    } finally {
      state.loadingMore = false;
    }
  };

  onMounted(() => {
    getHistoriesList();
  });
</script>
<template>
  <v-container
    fluid
    class="px-0"
  >
    <div
      class="d-flex align-center justify-space-between mt-6 px-5 w-100 text-subtitle-2 text-md-h6"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-list-box</v-icon>
        浏览记录
      </div>
      <v-icon class="cursor-pointer">mdi-chevron-right</v-icon>
    </div>
    <v-slide-group
      class="mt-2 w-100"
      scrollable
    >
      <v-slide-group-item
        v-for="(item, i) in [
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
          {
            title: 'hello world',
            img: '/ai-girl.png',
          },
        ]"
        :key="i"
      >
        <div
          class="mx-2"
          style="width: 120px"
        >
          <Image
            :src="item.img"
            width="120"
            height="60"
            cover
            class="rounded-md"
          />
          <div
            class="text-white text-caption text-truncate mt-1"
            :title="item.title"
          >
            {{ item.title }}
          </div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-container>
</template>
