<script lang="ts" setup>
  import CategoryMenu from "~/components/desktop/home/CategoryMenu.vue";
  import ArticleRightSidebar from "@/components/desktop/SidebarSection.vue";
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ActorProfile from "~/components/desktop/ActorProfile.vue";
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";

  const route = useRoute();
  const breadcrumbs = computed(() => {
    return [
      {
        text:
          route.params.categories == "home"
            ? "首页"
            : String(route.params.categories),
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
</script>

<template>
  <v-container class="mt-2">
    <CategoryMenu />
    <Breadcrumbs :items="breadcrumbs" />
    <v-row>
      <!-- Left Main Content -->
      <v-col
        cols="12"
        md="9"
        class="pr-md-10"
      >
        <v-card
          flat
          color="transparent"
        >
          <v-card-title class="text-h5 font-weight-bold">
            {{ articleDetail?.title }}
          </v-card-title>
          <v-card-subtitle class="text-grey text-caption my-2">
            2025-12-1 ｜ 作者：名字 ｜ 分类：名字 ｜ 标签：名字
          </v-card-subtitle>

          <!-- Summary -->
          <v-sheet
            color="#EEF0F8"
            class="pa-4 my-5"
          >
            {{ articleDetail?.intro }}
          </v-sheet>

          <!-- Ad Placeholder -->
          <v-sheet flat>
            <Image
              :src="articleDetail?.cover"
              height="100%"
            />
          </v-sheet>

          <!-- Article Body -->
          <div
            class="mt-5 text-body-1"
            v-html="articleDetail?.content"
          ></div>

          <!-- <div class="text-caption mb-4 text-grey">
            上海某大学医院附属新医学院鸟瞰图
          </div>

          <div class="text-body-1">
            正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文...
          </div> -->
        </v-card>
      </v-col>

      <!-- Right Sidebar -->
      <v-col
        cols="12"
        md="3"
      >
        <!-- 人物名称 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">相关人物</h3>
        <v-card class="pa-4 mb-6 elevation-0">
          <v-row v-if="articleDetail?.subject_posts.length">
            <v-col
              align="center"
              cols="6"
              v-for="(item, index) in articleDetail?.subject_posts"
            >
              <v-avatar
                size="48"
                class="mb-1"
              >
                <Image :src="item.cover" />
              </v-avatar>
              <div class="text-caption truncate-1">{{ item.name }}</div>
              <div class="text-grey text-caption text-xs truncate-2">
                {{ item.intro }}
              </div>
            </v-col>
          </v-row>
          <v-row
            class="pa-2"
            v-else
          >
            没有相关演员....
          </v-row>
        </v-card>

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <v-sheet class="pa-4">
          <ArticleListItem
            v-if="articleDetail?.subject_posts.length"
            v-for="(item, index) in articleDetail?.subject_posts"
            :key="index"
            :item="item"
          />
          <v-row
            class="pa-2"
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
