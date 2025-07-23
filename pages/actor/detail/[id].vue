<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";

  const { actorData, actorFilters } = useActor();
  const route = useRoute();
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
        text: actorData.value?.name,
        disabled: true,
      },
    ];
  });
</script>

<template>
  <v-container>
    <Breadcrumbs :items="breadcrumb" />
    <h2 class="text-h6 font-weight-bold mb-4">专题</h2>
    <v-row>
      <!-- Left content -->
      <v-col
        cols="12"
        md="8"
      >
        <!-- Topic summary card -->
        <template
          v-for="(item, index) in actorFilters?.items"
          :key="index"
        >
          <ArticleListItem
            :item="item"
            class="pa-2 cursor-pointer"
            @click="$router.push('/actor/article/' + item.id)"
            route-param="/actor"
          />
        </template>
      </v-col>

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
              @click="$router.push('/actor/article/' + actorData?.id)"
            >
              了解详情
            </v-btn>
          </div>
        </v-card>

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <v-card
          class="pa-4"
          flat
        >
          <Image
            src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
            height="160"
            cover
            class="rounded mt-2"
          />
          <v-card-text>
            <div class="truncate-2 mb-2">标题标题标题标题标题标题标题标题</div>
            <v-divider class="my-2"></v-divider>
            <ul class="text-body-2 text-grey-darken-1 ps-2">
              <li>标题标题标题标题标题标题标题标题</li>
              <li>标题标题标题标题标题标题标题标题</li>
              <li>标题标题标题标题标题标题标题标题</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
