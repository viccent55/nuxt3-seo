<script setup lang="ts">
  import { ref } from "vue";
  import { useNoteDialog, noteDialogVisible } from "@/hooks/useNoteDialog";
  import AuthorHeader from "./comp/AuthorHeader.vue";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { detail, like, collect, follow, reply } from "@/service/explore";
  import CommentBlock from "./comp/CommentBlock.vue";
  import BottomAction from "./comp/BottomAction.vue";
  import { adsClick } from "@/service/advert";
  import { getCurrentDomain } from "@/service";
  import { useDialogUXLock } from "@/hooks/useDialogUXLock";
  import { useDisplay } from "vuetify";

  const Swiper = defineAsyncComponent(() => import("../Swiper.vue"));
  const noteDIalogRef = useTemplateRef("note-dialog");
  const bottomRef = useTemplateRef("bottomActions");
  const { storeUser, store, onCopy, route, isMobile } = useVariable();
  const loading = ref(false);
  const noteDialog = useNoteDialog();
  const state = reactive({
    data: {} as EmptyObjectType,
    comments: [] as EmptyObjectType[],
  });
  const snackbar = useSnackbar();
  const { setStatus } = useCapacitor();

  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    loading.value = true;
    try {
      const request = {
        id: noteDialog.id.value,
        code: storeUser.visitCode,
      };
      const response = await detail(request);
      if (response.data) {
        state.data = response.data;
        getComments();
      }
      if (response.data?.errcode === 0 && Array.isArray(response.data.data)) {
        return response.data;
      }
    } catch (err) {
      console.error("fetchFeeds failed:", err);
    } finally {
      loading.value = false;
    }

    // disableHorizontalSwipe();
  };

  const swiperInstanceRef = ref<InstanceType<typeof Swiper> | null>(null);

  const getComments = async () => {
    if (!noteDialog.id.value) return;
    const response: EmptyObjectType = await $fetch(`/api/explore/comments`, {
      method: "POST",
      body: dataEncrypt({
        id: noteDialog.id.value,
      }),
    });
    const result = decrypt(response.data);
    if (result.data) {
      state.comments = result.data;
    }
  };
  const handle = {
    clickAuthor(id: string) {
      const url = `${window.location.origin}/user/${id}`;
      window.location.href = url;
      //   window.location.reload();
    },
    // 关注
    clickFollow(id: number) {
      checkPermissions(PERMISSION.User, async () => {
        const response: EmptyObjectType = await follow({
          id: id,
        });
        if (response.errcode == 0) {
          state.data.isFollow = !state.data.isFollow;
        } else {
          snackbar.showSnackbar(response.info, "warning");
        }
      });
    },
    // 点赞
    clickLike(item: EmptyObjectType) {
      checkPermissions(PERMISSION.User, async () => {
        const id_ = item.id;
        try {
          const response: EmptyObjectType = await like({
            id: id_,
          });
          if (response.errcode === 0) {
            state.data.isLike = !state.data.isLike;
            if (state.data.isLike) {
              state.data.like_count++;
            } else {
              state.data.like_count--;
            }
          } else {
            snackbar.showSnackbar(response.info, "warning");
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      });
    },
    // 分享`
    clickShare() {
      snackbar.showSnackbar("链接已复制!", "success", "top");
      onCopy(getCurrentDomain() + route.fullPath);
    },
    // 收藏
    clickStar(item: EmptyObjectType) {
      checkPermissions(PERMISSION.User, async () => {
        const id_ = item.id;
        try {
          const response: EmptyObjectType = await collect({
            id: id_,
          });
          if (response.errcode == 0) {
            state.data.isStar = !state.data.isStar;
            if (state.data.isStar) {
              item.collect_count++;
            } else {
              item.collect_count--;
            }
          } else {
            snackbar.showSnackbar(response.info, "warning");
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      });
    },

    // 评论
    clickReply(id: string, to: string | null) {
      checkPermissions(PERMISSION.User, () => {
        bottomRef.value?.inputFocus(id, to);
      });
    },
    // 提交评论
    clickReplyTo(id: string, content: string, to = {}) {
      checkPermissions(PERMISSION.User, async () => {
        const request = {
          id: id,
          content: content,
          to: to,
        };
        const res: EmptyObjectType = await reply(request);
        if (res.errcode != 0) return;
        state.data.comment_count++;
        getComments();
        state.data.totalCommentCount += 1;
      });
    },
  };
  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const getStyle = computed(() => {
    return isNative.value || smAndDown.value
      ? "height:100%; overflow-y: scroll"
      : "max-height: calc(100vh - 110px); overflow-y: scroll";
  });

  watch(
    () => noteDialogVisible.value,
    (val) => {
      setStatus(val);
      useDialogUXLock(noteDialogVisible);
    }
  );
</script>

<template>
  <v-dialog
    v-model="noteDialogVisible"
    max-width="1200"
    persistent
    height="100%"
    @after-enter="onOpenNoteDialog"
    :fullscreen="smAndDown"
    scrollable
  >
    <v-card
      class="main-contain"
      :loading="loading"
    >
      <v-card-text class="pa-0">
        <v-row
          no-gutters
          class="h-100"
        >
          <!-- Left: Video area -->
          <v-col
            cols="12"
            md="7"
            lg="8"
            class="d-flex align-center justify-center"
            :class="smAndDown ? '' : 'border-e-thin'"
          >
            <Swiper
              ref="swiperInstanceRef"
              v-if="state.data?.fields"
              :media-info="state.data.fields"
            />
            <v-btn
              v-if="smAndDown"
              class="back-button"
              icon
              density="compact"
              @click="noteDialog.closeNoteDialog"
              color="surface"
            >
              <v-icon size="24px">mdi-chevron-left</v-icon>
            </v-btn>
          </v-col>

          <!-- Right: Info & Comments -->
          <v-col
            cols="12"
            md="5"
            lg="4"
            :style="getStyle"
          >
            <div
              class="d-flex justify-space-between align-center mb-2 py-0 pr-4"
              v-if="!smAndDown"
            >
              <AuthorHeader
                :author="{
                  ...state.data?.author,
                  isFollow: state.data?.isFollow,
                }"
                @click-close="noteDialog.closeNoteDialog"
                @click-author="handle.clickAuthor"
                @click-follow="handle.clickFollow"
              />
              <v-btn
                icon
                size="small"
                @click="noteDialog.closeNoteDialog"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <!-- Scrollable Content Area -->
            <div
              class="flex-grow-1 overflow-y-auto px-4"
              ref="note-dialog"
            >
              <div class="text-body-1 font-weight-bold mb-2">
                {{ state.data?.title }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mb-4">
                {{ state.data?.content }}
              </div>
              <div class="text-body-2 text-grey-darken-1 mb-4">
                发布日期: {{ state.data?.created_at }}
              </div>

              <v-row dense>
                <v-col cols="12">
                  <v-toolbar
                    class="d-flex justify-space-between align-center mb-2 py-0 rounded"
                    density="compact"
                  >
                    <AuthorHeader
                      :author="{
                        ...state.data?.author,
                        isFollow: state.data?.isFollow,
                      }"
                      @click-close="noteDialog.closeNoteDialog"
                      @click-author="handle.clickAuthor"
                      @click-follow="handle.clickFollow"
                    />
                  </v-toolbar>
                </v-col>
                <v-col
                  v-for="(app, index) in store?.detailAppAds"
                  :key="index"
                  :cols="3"
                >
                  <NuxtLink
                    :to="app.url || '#'"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none text-grey-darken-1 d-flex flex-column ga-1 align-center"
                    @click="$emit('click-ads', app.id)"
                  >
                    <AdvertSlot
                      :advert="{
                        title: app.name,
                        image: app.image,
                        url: app?.url,
                      }"
                      fit="cover"
                      style="width: 28px; height: 28px"
                    />
                    {{ app.name }}
                  </NuxtLink>
                </v-col>
              </v-row>
              <v-divider
                :thickness="1"
                class="my-3 border-opacity-75"
              />

              <div>
                <div
                  class="text-subtitle-2 mb-2"
                  v-if="state.comments?.length"
                >
                  共 {{ state.comments?.length }} 条评论
                </div>
                <v-card
                  v-for="(app, index) in store?.detailAds"
                  :key="index"
                  class="pa-0 my-2"
                >
                  <a
                    :href="app.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class=""
                    @click="adsClick(app.id)"
                  >
                    <AdvertSlot
                      :advert="{
                        title: app.name,
                        image: app.image,
                        url: app?.url,
                      }"
                      height="100%"
                      fit="contain"
                    />
                  </a>
                </v-card>
                <template
                  v-for="block in state.comments"
                  :key="block.id"
                >
                  <CommentBlock
                    :comment="block"
                    @click-avatar="handle.clickAuthor"
                    @click-like="handle.clickLike"
                    @click-reply="handle.clickReply"
                  />
                </template>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="border-t">
        <BottomAction
          ref="bottomActions"
          :action="state.data"
          :total="state.data?.comment_count"
          @click-like="handle.clickLike"
          @click-star="handle.clickStar"
          @click-reply="handle.clickReply"
          @click-share="handle.clickShare"
          @click-reply-to="handle.clickReplyTo"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
  .main-contain {
    /* Add padding equal to the top safe area inset */
    padding-top: var(--safe-area-inset-top, 0px);
  }
  .back-button {
    position: absolute;
    top: calc(var(--safe-area-inset-top, 0px) + 10px);
    left: 10px;
    z-index: 20;
  }
</style>
