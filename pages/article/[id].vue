<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import { useTimeAgo, useEventListener } from "@vueuse/core";
  import CommentComponent from "./comment.vue";
  import Hls from "hls.js";

  const mainContentCol = ref();
  const commentSection = ref();
  const { decryptImage, decryptedImage } = useDecryption();

  const breadcrumbs = computed(() => {
    return [
      {
        text: "专题",
        href: "/",
      },
      {
        text: "文章",
        disabled: true,
      },
    ];
  });

  const { articleDetail } = useArticleDetail();
  const decryptedContent = ref("");
  const contentRef = ref<HTMLDivElement | null>(null);
  const hlsInstances = ref<Hls[]>([]);
  const floatingBarStyles = ref({});

  const updateFloatingBarPosition = () => {
    if (!mainContentCol.value?.$el) return;

    const rect = mainContentCol.value.$el.getBoundingClientRect();
    floatingBarStyles.value = {
      // Position it to the left of the main content column
      left: `${rect.left - 60}px`,
      // Vertically center it
      top: "50%",
      transform: "translateY(-50%)",
    };
  };

  onMounted(updateFloatingBarPosition);
  useEventListener(window, "resize", updateFloatingBarPosition);

  const initHlsForVideos = async () => {
    if (contentRef.value) {
      // Destroy previous instances to avoid memory leaks
      hlsInstances.value.forEach((hls) => hls.destroy());
      hlsInstances.value = [];

      const videos = contentRef.value.querySelectorAll("video");
      for (const video of videos) {
        const src = video.getAttribute("src");
        if (src && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hlsInstances.value.push(hls);
        }
      }
    }
  };

  // Watch for changes in the article detail
  watchEffect(async () => {
    if (articleDetail.value?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        articleDetail.value.content,
        "text/html"
      );
      // Decrypt images
      const images = doc.querySelectorAll("img[data-lazy-src]");
      for (const img of <any>images) {
        const lazySrc = img.getAttribute("data-lazy-src");
        if (lazySrc) {
          try {
            await decryptImage(lazySrc);
            img.src = decryptedImage.value;
          } catch (error) {
            console.error("Error decrypting image:", error);
          }
        } else {
          console.warn("Lazy source is undefined");
        }
      }

      // Decrypt videos
      // const videos = doc.querySelectorAll("video");
      // for (const video of videos) {
      //   const videoSrc = video.getAttribute("src");
      //   if (videoSrc) {
      //     await decryptImage(videoSrc);
      //     video.src = decryptedImage.value;
      //   }
      // }
      // Update decrypted content
      decryptedContent.value = doc.body.innerHTML;
    }
  });

  watch(decryptedContent, async () => {
    await nextTick();
    initHlsForVideos();
  });
  const loginDialogRef = ref();
  const onCommentClick = () => {
    const accessToken = useCookie("access_token");

    if (!accessToken.value) {
      loginDialogRef.value.openDialog();
    } else {
      // Scroll to the comment section
      commentSection.value?.$el?.scrollIntoView({ behavior: "smooth" });
    }
  };
  onBeforeUnmount(() => {
    hlsInstances.value.forEach((hls) => hls.destroy());
  });
</script>

<template>
  <v-container class="mt-2">
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
          <v-card-title class="text-h5 font-weight-bold">
            {{ articleDetail?.title }}
          </v-card-title>
          <v-card-subtitle
            class="text-grey text-caption my-2 d-flex align-center"
          >
            <span class="mr-2">{{ useTimeAgo(articleDetail?.created) }}</span>
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
                :to="`/${category.name}`"
              >
                {{ category.name }}
              </v-chip>
            </div>
          </v-card-subtitle>

          <!-- Summary -->
          <v-sheet
            color="#EEF0F8"
            class="pa-4 my-5"
          >
            {{ articleDetail?.intro }}
          </v-sheet>

          <!-- Ad Placeholder -->
          <v-sheet
            flat
            color="transparent"
          >
            <Image
              :src="articleDetail?.cover"
              height="100%"
              width="auto"
            />
          </v-sheet>
          <!-- Article Body -->
          <!-- {{ articleDetail?.content }} -->
          <div
            ref="contentRef"
            class="mt-5 text-body-1 article-content"
            style="max-width: 100%"
            v-html="decryptedContent"
          ></div>
          <div class="my-4 text-right d-flex ga-2 justify-end">
            <div
              v-if="articleDetail?.tags?.length"
              v-for="(tag, index) in articleDetail?.tags"
              :key="index"
            >
              <v-chip
                class="px-2"
                variant="text"
                border
                :to="`/article/${tag.id}`"
              >
                {{ tag.name }}
              </v-chip>
            </div>
          </div>
          <div class="d-flex justify-center ga-5">
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
          </div>
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
              >
                <v-icon color="grey">mdi-star</v-icon>
              </v-avatar>
              <span class="f12 text-grey">
                {{ articleDetail?.collect_count }}
              </span>
            </div>
            <div class="d-flex flex-column ga-1 align-center">
              <v-avatar
                size="36"
                color="surface"
              >
                <v-icon color="grey">mdi-thumb-up-outline</v-icon>
              </v-avatar>
              <span class="f12 text-grey">{{ articleDetail?.like_count }}</span>
            </div>
            <div
              class="d-flex flex-column ga-1 align-center cursor-pointer"
              @click="onCommentClick"
            >
              <v-avatar
                size="36"
                color="surface"
              >
                <v-icon color="grey">mdi-comment</v-icon>
              </v-avatar>
              <span class="f12 text-grey">
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
        <!-- 人物名称 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">相关人物</h3>
        <v-card class="pa-4 mb-6 elevation-0">
          <v-row v-if="articleDetail?.related_actors?.length">
            <v-col
              align="center"
              cols="6"
              v-for="(item, index) in articleDetail?.related_actors"
              :key="index"
              class="text-center cursor-pointer"
            >
              <NuxtLink
                :to="'/actor/detail/' + item.id"
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
          <v-row
            class="pa-4"
            v-else
          >
            没有相关演员....
          </v-row>
        </v-card>

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <v-sheet class="pa-3">
          <template
            v-for="(item, index) in articleDetail?.subject_posts"
            :key="index"
            v-if="articleDetail?.subject_posts?.length"
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
          <v-row
            class="pa-4"
            v-else
          >
            没有数据显示...
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
    <DesktopAuthLoginDialog ref="loginDialogRef" />
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
</style>
