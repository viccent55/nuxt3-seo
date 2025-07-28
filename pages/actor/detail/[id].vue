<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";

  const { actorData, actorFilters } = useActor();
  const breadcrumb = computed(() => {
    return [
      {
        text: "专题",
        href: "/actor",
      },
      {
        text: actorData.value?.name,
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
      <!-- Left content -->
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
              min-height="80%"
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
                <div v-html="actorData?.content"></div>
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
              v-for="item in actorFilters?.items"
              :key="item.id"
            >
              <ArticleListItem
                :item="item"
                class="pa-2 cursor-pointer"
                @click="$router.push('/article/' + item.id)"
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
        <v-card class="pa-4 mb-6 elevation-0">
          <div class="text-center">
            <v-avatar
              size="80"
              class="mx-auto mb-2"
            >
              <Image
                :src="actorData?.avatar"
                cover
              />
            </v-avatar>
            <div class="text-caption truncate-1">{{ actorData?.name }}</div>
            <div class="text-grey text-caption text-xs truncate-2">
              {{ actorData?.intro }}
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
          </div>
        </v-card>

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <DesktopActorCard :items="actorData?.subjects" />
      </v-col>
    </v-row>
  </v-container>
</template>
