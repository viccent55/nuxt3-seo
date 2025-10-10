<script lang="ts" setup>
  import { adsClick } from "@/service/advert";
  import { getCurrentDomain } from "@/service";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import CommentBlock from "@/components/explore/comp/CommentBlock.vue";
  import BottomAction from "@/components/explore/comp/BottomAction.vue";
  import { detail, like, collect, comment, comments } from "@/service/article";
  const bottomRef = useTemplateRef("bottomActions");

  const state = reactive({
    data: {} as EmptyObjectType,
    comments: [] as EmptyObjectType[],
    loading: false,
  });
  const { store, onCopy, route, isMobile } = useVariable();
  const snackbar = useSnackbar();
  const _id = route.params.id;

  const fetchDetail = async () => {
    state.loading = true;
    try {
      const request = {
        id: _id,
      };
      const response = await detail(request);
      if (response.data) {
        state.data = response.data;
        getComments();
      }
      return response.data;
    } catch (err) {
      console.error("fetchFeeds failed:", err);
    } finally {
      state.loading = false;
    }

    // disableHorizontalSwipe();
  };

  /* ---------------------------
     2. Initial SSR fetch
  ---------------------------- */
  await fetchDetail();

  const getComments = async () => {
    if (!_id) return;
    const response = await comments({ id: _id });
    if (response.data.length) {
      state.comments = response.data;
    }
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
        const res: EmptyObjectType = await comment(request);
        if (res.errcode != 0) return;
        state.data.comment_count++;
        getComments();
        state.data.totalCommentCount += 1;
      });
    },
  };
  useSeo(
    computed(() => state.data?.seo_title),
    computed(() => state.data?.seo_description),
    computed(() => state.data?.seo_keywords)
  );
</script>

<template>
  <v-container>
    <v-card
      class="main-contain"
      :loading="state.loading"
      flat
    >
      <v-row no-gutters>
        <!-- Left: Video area -->
        <v-col
          cols="12"
          md="7"
          lg="8"
          class="d-flex justify-center"
          :class="isMobile ? '' : 'border-e-thin'"
        >
          <v-card
            flat
            class="py-3"
          >
            <v-card-title
              class="text-break text-wrap overflow-visible whitespace-normal"
            >
              {{ state.data?.title }}
            </v-card-title>
            <v-card-text>
              <ContentArticle
                :content="state.data?.content"
                ref="contentArticleRef"
              />
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
          <!-- Scrollable Content Area -->
          <div
            class="flex-grow-1 overflow-y-auto px-4 pb-10 pb-md-0"
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
              <div class="text-subtitle-2 mb-2">
                共 {{ state.comments.length }} 条评论
              </div>
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
          <BottomAction
            ref="bottomActions"
            :action="state.data"
            :total="state.data?.comment_count"
            @click-like="handle.clickLike"
            @click-star="handle.clickStar"
            @click-reply="handle.clickReply"
            @click-share="handle.clickShare"
            @click-reply-to="handle.clickReplyTo"
            class="px-4"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<style scoped lang="scss">
  .main-contain {
    max-height: calc(100vh - 10rem);
    overflow-y: scroll;
  }
</style>
