<script setup lang="ts">
  import { ref } from "vue";
  import {
    useNoteAnimeDialog,
    noteDialogVisible,
  } from "@/hooks/useNoteAnimeDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { detail, like, collect } from "@/service/forbidden";
  import CommentBlock from "./comp/CommentBlock.vue";
  import BottomAction from "./comp/BottomAction.vue";
  import { adsClick } from "@/service/advert";
  import { getCurrentDomain } from "@/service";
  import { useDialogUXLock } from "@/hooks/useDialogUXLock";

  const VideoPlayer = defineAsyncComponent(
    () => import("@/components/Video.vue")
  );

  const noteDIalogRef = useTemplateRef("note-dialog");
  const bottomRef = useTemplateRef("bottomActions");
  const videoPlayerRef = ref();
  const { store, onCopy, route, isMobile } = useVariable();
  const loading = ref(false);
  const noteDialog = useNoteAnimeDialog();
  const state = reactive({
    data: {} as EmptyObjectType,
    comments: [] as EmptyObjectType[],
  });
  const { setStatus } = useCapacitor();
  const snackbar = useSnackbar();
  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    loading.value = true;
    try {
      const request = {
        id: noteDialog.id.value,
      };
      const response = await detail(request);
      if (response.data) {
        state.data = response.data;
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

  const handle = {
    clickAuthor(id: string) {
      const url = `${window.location.origin}/user/${id}`;
      window.location.href = url;
      //   window.location.reload();
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
              item.star_count++;
            } else {
              item.star_count--;
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
  };
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
    min-height="520px"
    persistent
    @after-enter="onOpenNoteDialog"
    scrollable
    :fullscreen="isMobile"
  >
    <v-card
      :loading="loading"
      class="main-contain"
    >
      <v-card-title v-if="isMobile">
        <div class="d-flex justify-end">
          <v-btn
            icon
            size="small"
            color="primary"
            @click="
              () => {
                noteDialog.closeNoteDialog();
                videoPlayerRef.value?.closeVideo();
                state.data = {};
              }
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text class="pa-0 pb-4">
        <v-row no-gutters>
          <!-- Left: Video area -->
          <v-col
            cols="12"
            md="7"
            lg="8"
          >
            <v-card flat>
              <v-card-title
                class="text-break text-wrap overflow-visible whitespace-normal"
              >
                {{ state.data?.title }}
              </v-card-title>
              <v-card-text class="pa-0">
                <VideoPlayer
                  v-if="state.data?.m3u8"
                  :src="state.data?.m3u8"
                  ref="videoPlayerRef"
                ></VideoPlayer>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right: Info & Comments -->
          <v-col
            cols="12"
            md="5"
            lg="4"
            class="d-flex flex-column"
          >
            <div
              class="d-flex justify-end mt-2 py-0 pr-4"
              v-if="!isMobile"
            >
              <v-btn
                icon
                size="small"
                @click="
                  () => {
                    noteDialog.closeNoteDialog();
                    videoPlayerRef.value?.closeVideo();
                    state.data = {};
                  }
                "
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <!-- Scrollable Content Area -->
            <div
              class="flex-grow-1 overflow-y-auto px-4"
              ref="note-dialog"
            >
              <div class="text-body-2 text-grey-darken-1 mb-4">
                发布日期: {{ state.data?.created_at?.split("T")[0] }}
              </div>
              <v-row dense>
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
                <v-card
                  v-for="(app, index) in store.detailAds"
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

      <v-card-actions class="d-flex border-t">
        <BottomAction
          ref="bottomActions"
          :action="state.data"
          :total="state.data?.comment_count"
          @click-like="handle.clickLike"
          @click-star="handle.clickStar"
          @click-reply="handle.clickReply"
          @click-share="handle.clickShare"
          class="px-4"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
  .main-contain {
    // padding-top: env(safe-area-inset-top, 0px);
    padding-top: var(--safe-area-inset-top, 0px);
    padding-bottom: var(--safe-area-inset-bottom, 0px);
  }
</style>
