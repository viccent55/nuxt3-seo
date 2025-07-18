<script lang="ts" setup>
  import ArticleRightSidebar from "@/components/desktop/SidebarSection.vue";
</script>

<template>
  <v-container class="py-4">
    <v-breadcrumbs class="mb-4 text-caption">
      <v-breadcrumbs-item href="/">
        <template #default>
          <span>首页</span>
          <v-icon
            class="mx-1"
            icon="mdi-chevron-right"
          ></v-icon>
        </template>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item href="/">
        <template #default>
          <span>首页</span>
          <v-icon
            class="mx-1"
            icon="mdi-chevron-right"
          ></v-icon>
        </template>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item disabled>文章标题</v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-row>
      <!-- Left Main Content -->
      <v-col
        cols="12"
        md="9"
      >
        <v-card flat>
          <v-card-title class="text-h5 font-weight-bold">
            标题标题标题标题标题标题标题标题标题标题标题标题
          </v-card-title>
          <v-card-subtitle class="text-grey text-caption">
            2025-12-1 ｜ 作者：名字 ｜ 分类：名字 ｜ 标签：名字
          </v-card-subtitle>

          <!-- Summary -->
          <v-alert
            type="info"
            variant="tonal"
            class="my-4"
          >
            不是形象具现而是思想具现。机器人具象化人的外观也可以是人形，也可以是动物形；机器人的获取信息也可以是视觉信息，也可以是情绪信息。
          </v-alert>

          <!-- Ad Placeholder -->
          <v-sheet
            class="pa-4 text-center my-4"
            color="#eaf3ff"
          >
            广告位
          </v-sheet>

          <!-- Subtitle -->
          <div class="text-h6 font-weight-bold mb-2">
            副标题副标题副标题副标题
          </div>

          <!-- Article Body -->
          <div class="mb-6 text-body-1">
            正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文...
          </div>

          <!-- Image -->
          <v-img
            class="my-4"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/ShanghaiTech_University_Aerial_View.jpg/1200px-ShanghaiTech_University_Aerial_View.jpg"
            alt="上海某大学医院附属新医学院鸟瞰图"
            height="400"
            cover
          />
          <div class="text-caption mb-4 text-grey">
            上海某大学医院附属新医学院鸟瞰图
          </div>

          <!-- More Body -->
          <div class="text-body-1">
            正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文...
          </div>
        </v-card>
      </v-col>

      <!-- Right Sidebar -->
      <ArticleRightSidebar />
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
