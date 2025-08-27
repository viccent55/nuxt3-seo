<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });

  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  import ArticleListItem from "~/components/desktop/ArticleList.vue";

  const { tagDetail, tagFilters, tagPosts } = useTag();
  const breadcrumb = computed(() => {
    return [
      {
        text: "首页",
        href: "/",
      },
      {
        text: "标签",
        href: "/tag",
      },
      {
        text: tagDetail.value?.name,
        disabled: true,
      },
    ];
  });

  const { data: subjects } = useFetch<ApiResponse>("/api/tag/subject", {
    method: "POST",
    body: {
      field: "home",
      with_actor: true,
      with_post: true,
      page: 1,
      limit: 30,
    },
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data?.items || [],
        count: res.data.count || 0,
      };
    },
  });

  const { data: actors } = useFetch<ApiResponse>("/api/tag/actor", {
    method: "POST",
    body: {
      field: "hot",
      with_actor: 1,
      with_post: true,
      page: 1,
      limit: 30,
    },
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data?.items || [],
        count: res.data.count || 0,
      };
    },
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
          <!-- <h2 class="text-h6 font-weight-bold mb-2">{{ tagDetail?.name }}</h2> -->
          <!-- <div class="text-caption">
           {{ tagDetail?.description }}
          </div> -->
        </v-col>
        <!-- Topic summary card -->
        <h1 class="text-h6 font-weight-bold mb-2">标签</h1>
        <template
          v-for="item in tagFilters?.items"
          :key="item.id"
        >
          <ArticleListItem
            :item="item"
            class="pa-2 cursor-pointer"
            @click="$router.push('/article/' + item.id)"
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
        <DesktopActorCard :items="subjects?.items" />

        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及人物</h3>
        <v-card
          flat
          class="pa-2"
        >
          <v-row dense>
            <v-col
              v-for="(actor, index) in actors?.items"
              :key="index"
              cols="4"
              class="text-center cursor-pointer"
              @click="$router.push('/article/' + actor.id)"
            >
              <v-avatar
                size="40"
                class="mb-1"
              >
                <Image :src="actor.avatar" />
              </v-avatar>
              <div class="text-caption truncate-1">{{ actor.name }}</div>
              <div class="text-grey text-caption text-xs truncate-2">
                {{ actor.intro }}
              </div>
            </v-col>
          </v-row>
        </v-card>
        <!-- 涉及人物 -->
        <h3 class="text-subtitle-1 font-weight-medium mt-4">推荐标签</h3>
        <v-card
          flat
          class="pa-4"
        >
          <v-chip
            v-for="(tag, index) in tagPosts?.items"
            :key="index"
            size="small"
            class="ma-1"
            color="surface-variant"
            variant="tonal"
            @click="$router.push('/tag/detail/' + tag.id)"
          >
            {{ tag.name }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
