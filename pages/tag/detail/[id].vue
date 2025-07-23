<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";

  const { tagData, tagFilters } = useTag();
  const breadcrumb = computed(() => {
    return [
      {
        text: "首页",
        href: "/",
      },
      {
        text: "专题",
        href: "/tag",
      },
      {
        text: tagData.value?.name,
        disabled: true,
      },
    ];
  });
</script>

<template>
  <v-container>
    <Breadcrumbs :items="breadcrumb" />

    <v-row>
      <!-- Left content -->
      <v-col
        cols="12"
        md="8"
      >
        <v-col
          cols="12"
          class="px-0"
        >
          <h2 class="text-h6 font-weight-bold mb-2">标签名称</h2>

          <div class="text-caption">
            专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍介绍专题介绍专题介绍专题介绍专
            题绍专题绍专题绍专题绍专题绍专题绍专题绍专题绍专题绍专题绍介绍专题介绍专题
          </div>
        </v-col>
        <!-- Topic summary card -->
        <h2 class="text-h6 font-weight-bold mb-2">标签名称</h2>
        <template
          v-for="item in tagFilters?.items"
          :key="item.id"
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
        <h3 class="text-subtitle-1 font-weight-medium mb-2">相关专题</h3>
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
            <div class="truncate-2 mb-2">
              标题标题标题标题标题标题标题标题标题 题标题标题标题
            </div>
            <v-divider class="my-2"></v-divider>
            <ul class="text-body-2 text-grey-darken-1 ps-2">
              <li>标题标题标题标题标题标题标题标题标题</li>
              <li>标题标题标题标题标题标题标题标题标题</li>
              <li>标题标题标题标题标题标题标题标题标题</li>
              <li>标题标题标题标题标题标题标题标题标题</li>
            </ul>
          </v-card-text>
        </v-card>
        <!-- 涉及人物 -->
        <h3 class="text-subtitle-1 font-weight-medium mt-4">涉及人物</h3>
        <SidebarSection title="热门人物">
          <v-sheet>
            <v-row class="mt-2">
              <v-col
                v-for="(item, index) in tagData?.actors"
                :key="index"
                cols="4"
                class="text-center cursor-pointer"
                @click="$router.push('/home/article/' + item.id)"
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
          </v-sheet>
        </SidebarSection>
      </v-col>
    </v-row>
  </v-container>
</template>
