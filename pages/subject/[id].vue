<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });

  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";
  import { useStore } from "~/store";

  const { subjectFilters, subjectData } = useSubject();
  const breadcrumb = computed(() => {
    return [
      {
        text: "首页",
        href: "/",
      },
      {
        text: "专题",
        href: "/subject",
      },
      {
        text: subjectData.value?.name,
        disabled: true,
      },
    ];
  });
  useSeo(
    computed(() => subjectData.value?.seo_title),
    computed(() => subjectData.value?.seo_description),
    computed(() => subjectData.value?.seo_title)
  );
  const store = useStore();

  const showContent = ref(false);
</script>

<template>
  <v-container>
    <Breadcrumbs :items="breadcrumb" />
    <h1 class="text-h6 font-weight-bold mb-4">{{ subjectData?.name }} 专题</h1>
    <v-row>
      <!-- Left content with transition -->
      <v-slide-y-transition mode="out-in">
        <template v-if="showContent">
          <v-col
            key="content"
            cols="12"
            md="8"
          >
            <v-card
              color="surface"
              flat
            >
              <v-card-title class="text-right">
                <v-spacer />
                <v-btn
                  variant="outlined"
                  elevation="0"
                  size="small"
                  @click="showContent = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <ContentArticle
                  class="px-5"
                  :content="subjectData?.content"
                  :skeleton="6"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <template v-else>
          <v-col
            key="summary"
            cols="12"
            md="8"
          >
            <template
              v-for="item in subjectFilters?.items"
              :key="item.id"
            >
              <NuxtLink
                :to="`/article/${item.id}`"
                class="text-decoration-none"
              >
                <ArticleListItem
                  :item="item"
                  class="pa-2 cursor-pointer"
                  route-param="/subject"
                />
              </NuxtLink>
            </template>
          </v-col>
        </template>
      </v-slide-y-transition>

      <!-- Right sidebar -->
      <v-col
        cols="12"
        md="4"
      >
        <!-- 人物名称 -->
        <v-card class="elevation-0">
          <Image
            :src="subjectData?.cover"
            cover
            height="180"
          />
          <v-card-text class="text-center">
            <div class="text-caption truncate-1">{{ subjectData?.name }}</div>
            <div class="text-grey text-caption text-xs truncate-2">
              {{ subjectData?.intro }}
            </div>
            <v-btn
              class="mt-2"
              size="small"
              variant="outlined"
              color="primary"
              @click="showContent = true"
            >
              了解详情
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card
          elevation="0"
          class="mt-4"
          v-for="ads in store?.advertisement?.POSITION_HOME_RIGHT"
          :key="ads.id"
        >
          <DesktopAdvertSlot :advert="ads" />
        </v-card>
        <SocialNetwork class="mt-4" />
        <!-- 涉及专题 -->
        <!-- <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及人物</h3> -->
        <v-sheet
          class="mt-4"
          v-if="subjectData?.actors?.length > 0"
        >
          <v-row>
            <v-col
              v-for="(item, index) in subjectData?.actors"
              :key="index"
              cols="4"
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
                  {{ item.intro }}
                </div>
              </NuxtLink>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
