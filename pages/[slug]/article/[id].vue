<script lang="ts" setup>
  import CategoryMenu from "~/components/desktop/home/CategoryMenu.vue";
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import { useTimeAgo } from "@vueuse/core";
  import CommentComponent from "./comment.vue";

  const route = useRoute();
  const breadcrumbs = computed(() => {
    return [
      {
        text: route.params.slug == "home" ? "首页" : String(route.params.slug),
        href: "/",
      },
      {
        text: "专题",
        href: "/subject",
      },
      {
        text: "专题名称",
        disabled: true,
      },
    ];
  });

  const { articleDetail } = useArticleDetail();
  const router = useRouter();
  const onNavigatoArticle = (id: number) => {
    router.push(`/${route.params.slug}/article/${id}`);
  };
</script>

<template>
  <v-container class="mt-2">
    <CategoryMenu />
    <Breadcrumbs :items="breadcrumbs" />
    <v-row>
      <!-- Left Main Content -->
      <v-col
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
          <div
            class="mt-5 text-body-1"
            v-html="articleDetail?.content"
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
                @click="onNavigatoArticle(tag.id)"
              >
                {{ tag.name }}
              </v-chip>
            </div>
          </div>
          <div class="d-flex justify-center ga-5">
            <v-btn
              elevation="0"
              color="info"
            >
              上一篇：文章标题文章
            </v-btn>
            <v-btn
              elevation="0"
              color="info"
              @click="onNavigatoArticle(articleDetail?.id)"
            >
              上一篇：文章标题文章
            </v-btn>
          </div>
          <CommentComponent />
        </v-card>
        <div
          class="position-absolute"
          style="left: -40px; bottom: 40px"
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
            <div class="d-flex flex-column ga-1 align-center">
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
              @click="onNavigatoArticle(item.id)"
            >
              <v-avatar
                size="48"
                class="mb-1"
              >
                <Image :src="item.avatar" />
              </v-avatar>
              <div class="text-caption truncate-1">{{ item.name }}</div>
              <div class="text-grey text-caption text-xs truncate-2">
                {{ item.intro }}
              </div>
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
              :to="'/home/article/' + item.id"
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
  </v-container>
</template>

<style scoped lang="scss"></style>
