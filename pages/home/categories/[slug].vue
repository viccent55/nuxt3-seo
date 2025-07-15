<script lang="ts" setup>
  import SidebarSection from "~/components/desktop/categories/SidebarSection.vue";
  import ArticleCard from "~/components/desktop/categories/ArticleCard.vue";
  import ArticleListItem from "~/components/desktop/categories/ArticleListItem.vue";
  import ArticleList from "~/components/desktop/categories/ArticleList.vue";
  import SectionTitle from "~/components/desktop/categories/SectionTitle.vue";


</script>
<template>
  <v-container fluid>
    <v-row>
      <!-- Main Content -->
      <v-col
        cols="12"
        md="8"
      >
        <!-- 最新专题 -->
        <SectionTitle title="最新专题" />
        <v-row>
          <v-col
            v-for="n in 6"
            :key="n"
            cols="12"
            sm="6"
            md="4"
          >
            <ArticleCard />
          </v-col>
        </v-row>

        <!-- 最新文章 -->
        <SectionTitle title="最新文章" />
        <ArticleList />

        <!-- 广告位 -->
        <v-sheet class="pa-6 text-center bg-blue-lighten-5 my-4">
          广告位
        </v-sheet>

        <ArticleList />
      </v-col>

      <!-- Sidebar -->
      <v-col
        cols="12"
        md="4"
      >
        <SidebarSection title="推荐文章">
          <ArticleListItem
            v-for="n in 3"
            :key="n"
          />
        </SidebarSection>

        <SidebarSection title="活动参与">
          <v-carousel height="200">
            <v-carousel-item
              v-for="i in 2"
              :key="i"
            >
              <v-img src="https://via.placeholder.com/400x200" />
            </v-carousel-item>
          </v-carousel>
        </SidebarSection>

        <SidebarSection title="热门人物">
          <v-row>
            <v-col
              v-for="i in 6"
              :key="i"
              cols="4"
              class="text-center"
            >
              <v-avatar
                size="48"
                class="mb-1"
              >
                <v-img src="https://via.placeholder.com/48" />
              </v-avatar>
              <div class="text-caption">名字</div>
              <div class="text-grey text-caption">所属栏目</div>
            </v-col>
          </v-row>
        </SidebarSection>

        <SidebarSection title="热门专题">
          <v-img src="https://via.placeholder.com/400x200" />
        </SidebarSection>
      </v-col>
    </v-row>
  </v-container>
</template>
