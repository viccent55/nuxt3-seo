<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });

  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import { useEventListener } from "@vueuse/core";
  import CommentComponent from "./comment.vue";

  const mainContentCol = ref();
  const { formatTime, store } = useVariable();
  const breadcrumbs = computed(() => {
    return [
      {
        text: "首页",
        href: "/",
      },
      {
        text: "文章",
        disabled: true,
      },
    ];
  });

  const {
    articleDetail,
    onLikeArticle,
    onCommentClick,
    onCollect,
    commentSection,
    onViewCount,
    isLiked,
    isCollected,
  } = useArticleDetail();
  const floatingBarStyles = ref({});

  const updateFloatingBarPosition = () => {
    if (!mainContentCol.value?.$el) return;

    const rect = mainContentCol.value.$el.getBoundingClientRect();
    const left = Math.max(8, rect.left - 60); // at least 8px padding on mobile

    floatingBarStyles.value = {
      left: `${left}px`,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 100,
    };
  };
  useSeo(
    computed(() => articleDetail.value?.title),
    computed(() => articleDetail.value?.seo_description),
    computed(() => articleDetail.value?.seo_keywords)
  );
  onMounted(() => {
    updateFloatingBarPosition();

    onViewCount();
  });
  useEventListener(window, "resize", updateFloatingBarPosition);
</script>

<template>
  <v-container class="pt-0">
    <Breadcrumbs :items="breadcrumbs" />
    <v-row>
      <!-- Left Main Content -->
      <v-col
        ref="mainContentCol"
        cols="12"
        md="8"
        class="position-relative"
      >
        <v-card
          flat
          color="transparent"
        >
          <v-card-title
            class="text-h5 font-weight-bold text-wrap"
            tag="h1"
          >
            {{ articleDetail?.title }}
          </v-card-title>
          <v-card-subtitle class="d-flex align-center justify-space-between">
            <div class="d-flex text-grey text-caption my-2 align-center">
              <span class="mr-2">{{ formatTime(articleDetail?.created) }}</span>
              <div
                v-if="articleDetail?.categories?.length"
                class="d-flex ga-2"
                v-for="(category, index) in articleDetail?.categories"
                :key="index"
              >
                <v-divider
                  thickness="2"
                  vertical
                ></v-divider>
                <v-chip
                  class="px-2"
                  variant="text"
                  size="small"
                  :to="`/category_${category.id}`"
                >
                  {{ category.name }}
                </v-chip>
              </div>
            </div>
            <div class="d-flex ga-2">
              <div
                v-if="articleDetail?.actors?.length"
                class="d-flex ga-2"
                v-for="(actor, index) in articleDetail?.actors"
                :key="index"
              >
                <v-chip
                  class="px-2"
                  variant="text"
                  size="small"
                  :to="`/actor/${actor.id}`"
                >
                  {{ actor.name }}
                </v-chip>
              </div>
              <div
                v-if="articleDetail?.subjects?.length"
                class="d-flex ga-2"
                v-for="(subject, index) in articleDetail?.subjects"
                :key="index"
              >
                <v-chip
                  class="px-2"
                  variant="text"
                  size="small"
                  :to="`/subject/${subject.id}`"
                >
                  {{ subject.name }}
                </v-chip>
              </div>
            </div>
          </v-card-subtitle>

          <!-- Summary -->
          <v-sheet
            color="#EEF0F8"
            class="pa-4 my-5"
          >
            {{ articleDetail?.intro }}
          </v-sheet>

          <!-- Ads before content -->
          <v-row>
            <v-col
              cols="12"
              v-for="(item, index) in store.advertisement
                ?.POSITION_DETAIL_AFTER_TITLE"
              :key="index"
            >
              <DesktopAdvertSlot
                :advert="item"
                class="detail-ads-ratio"
              />
            </v-col>
          </v-row>
          <!-- {{ articleDetail?.content }} -->

          <ContentArticle
            :content="articleDetail?.content"
            :skeleton="16"
          />
          <div class="my-4 d-flex ga-2 justify-end">
            <div
              v-if="articleDetail?.tags?.length"
              v-for="(tag, index) in articleDetail?.tags"
              :key="index"
            >
              <v-chip
                class="px-2 bg-none text-grey"
                size="small"
                :to="`/article/${tag.id}`"
              >
                {{ tag.name }}
              </v-chip>
            </div>
          </div>
          <!-- Ads after content -->
          <v-row>
            <v-col
              cols="12"
              v-for="(item, index) in store.advertisement
                ?.POSITION_DETAIL_AFTER_CONTENT"
              :key="index"
            >
              <DesktopAdvertSlot
                :advert="item"
                class="detail-ads-ratio"
              />
            </v-col>
          </v-row>

          <!-- <div class="d-flex justify-center ga-5">
            <v-btn
              v-if="articleDetail?.prev"
              elevation="0"
              color="info"
              :to="`/article/${articleDetail?.prev.id}`"
            >
              上一篇：文章标题文章
            </v-btn>
            <v-btn
              v-if="articleDetail?.next"
              elevation="0"
              color="info"
              :to="`/article/${articleDetail?.next.id}`"
            >
              上一篇：文章标题文章
            </v-btn>
          </div> -->
          <CommentComponent ref="commentSection" />
        </v-card>
        <div
          class="position-fixed"
          :style="floatingBarStyles"
        >
          <div class="d-flex flex-column ga-2">
            <div class="d-flex flex-column ga-1 align-center">
              <v-avatar
                size="36"
                color="surface"
                class="cursor-pointer"
                @click="onCollect"
              >
                <v-icon :color="isCollected ? 'primary' : 'disabled'">
                  mdi-star
                </v-icon>
              </v-avatar>
              <span class="f12 text-disabled">
                {{
                  isCollected
                    ? articleDetail?.collect_count + 1
                    : articleDetail?.collect_count
                }}
              </span>
            </div>
            <div class="d-flex flex-column ga-1 align-center">
              <v-avatar
                size="36"
                color="surface"
                class="cursor-pointer"
                @click="onLikeArticle"
              >
                <v-icon :color="isLiked ? 'primary' : 'disabled'">
                  mdi-thumb-up-outline
                </v-icon>
              </v-avatar>
              <span class="f12 text-disabled">
                {{
                  isLiked
                    ? articleDetail?.like_count + 1
                    : articleDetail?.like_count
                }}
              </span>
            </div>
            <div
              class="d-flex flex-column ga-1 align-center cursor-pointer"
              @click="onCommentClick"
            >
              <v-avatar
                size="36"
                color="surface"
              >
                <v-icon color="disabled">mdi-comment</v-icon>
              </v-avatar>
              <span class="f12 text-disabled">
                {{ articleDetail?.comment_count }}
              </span>
            </div>
            <!-- <div class="d-flex flex-column ga-1 align-center">
              <v-avatar
                size="36"
                color="surface"
              >
                <v-icon color="grey">mdi-share</v-icon>
              </v-avatar>
              <span class="f12 text-grey">{{ articleDetail?.share_count }}</span>
            </div> -->
          </div>
        </div>
      </v-col>

      <!-- Right Sidebar -->
      <v-col
        cols="12"
        md="4"
        class="pl-md-12"
      >
        <SocialNetwork />
        <!-- 人物名称 -->
        <v-sheet
          color="transparent"
          class="d-none d-sm-block mt-2"
          v-if="articleDetail?.related_actors?.length"
        >
          <h3 class="text-subtitle-1 font-weight-medium mb-2">相关人物</h3>
          <v-card class="pa-4 elevation-0">
            <v-row>
              <v-col
                align="center"
                cols="6"
                v-for="(item, index) in articleDetail?.related_actors"
                :key="index"
                class="text-center cursor-pointer"
              >
                <NuxtLink
                  :to="`/actor/${item.id}`"
                  class="text-decoration-none text-grey"
                >
                  <v-avatar
                    size="45"
                    class="mb-1"
                  >
                    <Image :src="item.avatar" />
                  </v-avatar>
                  <div class="text-caption truncate-1">{{ item.name }}</div>
                  <div class="text-grey text-caption text-xs truncate-2">
                    {{ item?.intro }}
                  </div>
                </NuxtLink>
              </v-col>
            </v-row>
          </v-card>
        </v-sheet>
        <v-row class="mt-5">
          <v-col
            cols="12"
            v-for="(item, index) in store.advertisement?.POSITION_DETAIL_RIGHT"
            :key="index"
          >
            <DesktopAdvertSlot
              :advert="item"
              class="detail-right-ads-ratio"
            />
          </v-col>
        </v-row>
        <!-- 涉及专题 -->
        <v-card
          class="mt-5 elevation-0 d-none d-sm-block"
          color="transparent"
          v-if="articleDetail?.subject_posts.length"
        >
          <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
          <v-sheet class="pa-3">
            <template
              v-for="(item, index) in articleDetail?.subject_posts"
              :key="index"
            >
              <ArticleListItem
                class="pa-2"
                :item="item"
                :to="'/article/' + item.id"
              />
              <v-divider
                class="my-2"
                v-if="index < articleDetail?.subject_posts?.length - 1"
              ></v-divider>
            </template>
          </v-sheet>
        </v-card>
        <v-card
          elevation="0"
          class="mt-5 pa-4"
        >
          <div>
            <v-row
              align="start"
              dense
            >
              <v-col
                v-for="(item, index) in store.advertisement
                  ?.POSITION_DETAIL_RECOMMEND_APP"
                :key="index"
                cols="4"
                sm="3"
                class="d-flex flex-column align-center"
              >
                <NuxtLink
                  :to="item.url"
                  class="text-decoration-none text-surface-variant"
                  target="_blank"
                >
                  <Image
                    :src="item.image"
                    contain
                    height="36px"
                  ></Image>
                  <div
                    class="text-center text-caption mt-1 text-truncate"
                    style="max-width: 100px"
                  >
                    {{ item.name }}
                  </div>
                </NuxtLink>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
  .article-content :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin-inline: auto;
    // border-radius: 4px;
  }
  .article-content :deep(video) {
    max-width: 100%;
    height: auto;
    display: block;
    margin-inline: auto;
    // border-radius: 4px;
  }
  .detail-ads-ratio {
    display: block;
    width: 100%;
    max-width: 770px;
    aspect-ratio: 770 / 90; 
    object-fit: contain;
  }
  .detail-right-ads-ratio {
    display: block;
    width: 100%;
    max-width: 373px;
    aspect-ratio: 373 / 80; 
    object-fit: contain;
  }
</style>
