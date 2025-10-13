<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });
  import { useRoute } from "vue-router";
  import { useInfiniteScroll } from "@vueuse/core";
  import { useStore } from "@/store";
  import { useUserStore } from "@/store/user";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";

  import { UserChannelItems } from "@/common";
  const exploreContainerRef = ref<{ element: HTMLElement } | null>(null);
  import {
    getNoteFeeds,
    getStarFeeds,
    getLikeFeeds,
    getUserInfo,
  } from "@/service/user";
  import { retrySendEmailCode, veryCode } from "@/service/user";
  import { follow } from "@/service/explore";
import UserInfo from "~/components/user/UserInfo.vue";

  const route = useRoute();
  const noteDialog = useNoteDialog();

  const channel = ref<string>("note");
  const userInfo = ref<any>({});
  const id = computed(() => Number(route.params.id));
  const page = ref(1);
  const isLoadMore = ref(false);
  const code = ref("");
  const pending = ref(true); // Add a pending state for initial load

  const noteFeeds = ref<any[]>([]);
  const starFeeds = ref<any[]>([]);
  const likesFeeds = ref<any[]>([]);
  const isNoMore = ref(false);

  const showFeeds = computed(() => {
    if (channel.value === "note") return noteFeeds.value;
    if (channel.value === "star") return starFeeds.value;
    if (channel.value === "like") return likesFeeds.value;
    return [];
  });

  const getRes = {
    noteFeeds: async () => {
      const request = {
        id: id.value,
        page: page.value,
        limit: 30,
      };
      const res = await getNoteFeeds(request);
      if (res.errcode === 0 && res.data) {
        noteFeeds.value = [...noteFeeds.value, ...res.data];
        if (!res.data.length) isNoMore.value = true;
      }
    },
    starFeeds: async () => {
      const res = await getStarFeeds({ id: id.value, page: page.value });
      if (res.errcode === 0 && res.data) {
        starFeeds.value = [...starFeeds.value, ...res.data];
        if (!res.data.length) isNoMore.value = true;
      }
    },
    likeFeeds: async () => {
      const res = await getLikeFeeds({ id: id.value, page: page.value });
      if (res.errcode === 0 && res.data) {
        likesFeeds.value = [...likesFeeds.value, ...res.data];
        if (!res.data.length) isNoMore.value = true;
      }
    },
  };

  const handle = {
    clickChannel(item: any) {
      channel.value = item.value;
    },
    clickFollow(user: any) {
      checkPermissions(PERMISSION.User, async () => {
        const res = await follow({
          id: id.value,
        });
        if (res.errcode === 0) user.isFollow = !user.isFollow;
      });
    },

    clickFeed(feed: any) {
      noteDialog.openNoteDialog(feed.id);
    },
  };

  const onLoadMore = async (done?: () => void) => {
    if (pending.value || isLoadMore.value || isNoMore.value) return;
    isLoadMore.value = true;
    page.value++;

    try {
      const fetcher =
        channel.value === "note"
          ? getRes.noteFeeds
          : channel.value === "star"
            ? getRes.starFeeds
            : getRes.likeFeeds;
      await fetcher();
    } finally {
      isLoadMore.value = false;
      if (done) done();
    }
  };

  const resetItems = () => {
    noteFeeds.value = [];
    starFeeds.value = [];
    likesFeeds.value = [];
  };

  const onInit = async () => {
    pending.value = true;
    const res = await getUserInfo(id.value);

    userInfo.value = res.data;
    try {
      await getRes.noteFeeds();
    } finally {
      // Use nextTick to allow the DOM to update before `pending` is set to false
      nextTick(() => (pending.value = false));
    }
  };

  watch(channel, async () => {
    page.value = 1;
    isNoMore.value = false;
    pending.value = true;
    try {
      if (channel.value === "note")
        ((noteFeeds.value = []), await getRes.noteFeeds());
      else if (channel.value === "star")
        ((starFeeds.value = []), await getRes.starFeeds());
      else ((likesFeeds.value = []), await getRes.likeFeeds());
    } finally {
      nextTick(() => (pending.value = false));
    }
  });

  const store = useStore();
  const userStore = useUserStore();
  const self = computed(() => userStore.useId === userInfo.value.id);

  const isShowPupup = ref(false);
  const loading = ref(false);
  const snackbar = useSnackbar();
  const onVeryEmail = async () => {
    if (!userInfo.value.email) {
      snackbar.showSnackbar("请输入您的代码", "warning");
      return;
    }
    try {
      loading.value = true;
      const response = await retrySendEmailCode({
        email: userInfo.value.email,
      });

      if (response.errcode === 0) {
        snackbar.showSnackbar(response.info, "success", "top");
        isShowPupup.value = true;
      } else {
        snackbar.showSnackbar(response.info, "error");
      }
      isShowPupup.value = true;
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      loading.value = false;
    }
  };

  const verifyEmail = async () => {
    if (!userInfo.value.email) {
      snackbar.showSnackbar("请输入您的代码", "warning");
      return;
    }
    if (!code.value) {
      snackbar.showSnackbar("需要代码！", "error");
      return;
    }
    try {
      const response = await veryCode({
        email: userInfo.value.email,
        code: code.value,
      });
      if (response.errcode === 0) {
        snackbar.showSnackbar(response.info, "success");
      } else {
        snackbar.showSnackbar(response.info, "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const pageWrapperRef = ref<HTMLElement | null>(null);
  useInfiniteScroll(
    pageWrapperRef,
    () => {
      onLoadMore();
    },
    {
      distance: 300,
      canLoadMore: () => !pending.value && !isLoadMore.value && !isNoMore.value,
    }
  );
  onBeforeMount(() => {
    onInit();
  });

  const filterTabs = computed(() => {
    if (self.value) {
      return UserChannelItems;
    } else {
      return UserChannelItems.filter((item) => item.value == "note");
    }
  });
</script>

<template>
  <div
    class="user-page-wrapper"
    ref="pageWrapperRef"
  >
    <div
      class="user-background"
      :style="{
        backgroundImage: `url(${store?.configuration?.member_center_background})`,
      }"
    ></div>

    <div class="user-content-container">
      <div class="user-content mx-md-4">
        <UserInfo
          :user="userInfo"
          @click-follow="handle.clickFollow"
          @refresh="onInit"
        />
        <v-alert
          v-if="self && userInfo.status == 0"
          type="warning"
          class="mt-4"
          border="start"
        >
          ⚠️ 未验证邮箱 {{ userInfo.email }} 验证后可订阅最新域名防止失联
          <v-btn
            small
            color="primary"
            :loading="loading"
            class="ml-2"
            @click="onVeryEmail"
          >
            验证邮箱
          </v-btn>
        </v-alert>

        <div class="channel-wrapper my-5">
          <v-btn-toggle
            v-model="channel"
            density="comfortable"
            mandatory
          >
            <v-btn
              active-color="primary"
              v-for="(item, index) in filterTabs"
              :value="item.value"
              :key="index"
            >
              {{ item.name }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <ExploreContainer
          ref="exploreContainerRef"
          :items="showFeeds"
          :is-load-more="isLoadMore"
          :is-no-more="isNoMore"
          :scroll-container="pageWrapperRef"
          @click-item="handle.clickFeed"
        />
      </div>
    </div>

    <v-dialog
      v-model="isShowPupup"
      max-width="450"
    >
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text class="pb-0">
          <v-form>
            <v-text-field
              label="验证码"
              v-model="code"
              type="number"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex justify-end ga-3 ma-2">
            <v-btn
              variant="elevated"
              @click="isShowPupup = false"
            >
              取消
            </v-btn>
            <v-btn
              variant="elevated"
              @click="verifyEmail"
              color="primary"
            >
              确认
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
  .user-page-wrapper {
    position: relative;
    width: 100%;
    margin-top: 20px;
    height: calc(100vh - 80px); /* Adjust based on your header height */
    overflow-y: auto;
    scrollbar-width: none;
  }
  .user-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  .user-content-container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .user-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .channel-wrapper {
    width: fit-content;
  }
  .feeds-container {
    width: 100%;
    padding: 0 16px;
    flex-grow: 1;
  }
</style>
