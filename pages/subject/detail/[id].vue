<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";

  const { subjectFilters, subjectData } = useSubject();
  const breadcrumb = computed(() => {
    return [
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
  const showContent = ref(false);
</script>

<template>
  <v-container>
    <Breadcrumbs :items="breadcrumb" />
    <h2 class="text-h6 font-weight-bold mb-4">专题</h2>
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
                <div v-html="subjectData?.content"></div>
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
              <ArticleListItem
                :item="item"
                class="pa-2 cursor-pointer"
                @click="$router.push('/subject/article/' + item.id)"
                route-param="/subject"
              />
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
        <h3 class="text-subtitle-1 font-weight-medium mb-2">人物名称</h3>
        <v-card class="mb-6 elevation-0">
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

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <v-sheet>
          <v-row class="mt-2">
            <v-col
              v-for="(item, index) in subjectData?.actors"
              :key="index"
              cols="4"
              class="text-center cursor-pointer"
              @click="$router.push('/subject/article/' + item.id)"
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
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
