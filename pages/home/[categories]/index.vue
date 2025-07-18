<script lang="ts" setup>
  import SidebarSection from "~/components/desktop/SidebarSection.vue";
  import ArticleCard from "~/components/desktop/ArticleCard.vue";
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import ArticleList from "~/components/desktop/ArticleList.vue";
  import SectionTitle from "~/components/desktop/SectionTitle.vue";
  defineProps({
    subject: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
  });
  const state = reactive({
    latest: [] as EmptyArrayType,
    paginate: {
      page: 1,
      limit: 10,
      total: 0,
    },
  });

  const { filterHome } = useHome();
  const { data: latest } = await useAsyncData<any>(
    "latest",
    () =>
      $fetch("/api/home/latest", {
        method: "POST",
        body: {
          page: state.paginate.page,
          limit: state.paginate.limit,
        },
      }),
    {
      watch: [state.paginate],
      transform: (res) => {
        state.latest = [];
        // ✅ Filter or map your data here
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );

  watchEffect(() => {
    if (latest.value) {
      state.latest = latest.value.items ?? [];
      if (latest.value.count) {
        state.paginate.total = latest.value.count;
      }
    }
  });

  const onPageChange = (newPage: number) => {
    state.paginate.page = newPage;
  };

  const comments = [
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
  ];
</script>
<template>
  <v-container fluid>
    <v-row>
      <!-- Main Content -->
      <v-col
        cols="12"
        md="8"
      >
        <!-- Latest topics -->
        <SectionTitle title="最新专题" />
        <v-row>
          <v-col
            v-for="(item, index) in subject"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <ArticleCard :item="item" />
          </v-col>
        </v-row>

        <!-- Latest text -->
        <SectionTitle title="最新文章" />
        <template
          v-for="(item, index) in state.latest"
          :key="index"
        >
          <ArticleList :item="item" />
          <!-- Advertisement space -->

          <v-sheet
            v-if="index < state.latest.length - 1"
            class="pa-6 text-center my-4"
            color="blue-lighten-5"
          >
            广告位
          </v-sheet>
        </template>

        <!-- <Pagination /> -->
        <div class="text-center mt-4">
          <v-pagination
            density="comfortable"
            :model-value="state.paginate.page"
            :length="Math.ceil(state.paginate.total / state.paginate.limit)"
            :total-visible="10"
            active-color="primary"
            @update:model-value="onPageChange"
          ></v-pagination>
        </div>
      </v-col>

      <!-- Sidebar -->
      <v-col
        cols="12"
        md="4"
      >
        <SidebarSection title="推荐文章">
          <v-sheet class="pa-4">
            <ArticleListItem
              v-for="(item, index) in filterHome.items"
              :key="index"
              :item="item"
            />
          </v-sheet>
        </SidebarSection>

        <SidebarSection title="活动参与">
          <v-carousel
            height="200"
            show-arrows
            hide-delimiters
            hide-delimiter-background
          >
            <template v-slot:prev="{ props }">
              <v-btn
                variant="elevated"
                icon="mdi-chevron-left"
                @click="props.onClick"
                density="compact"
              ></v-btn>
            </template>
            <template v-slot:next="{ props }">
              <v-btn
                variant="elevated"
                @click="props.onClick"
                density="compact"
                icon="mdi-chevron-right"
              ></v-btn>
            </template>
            <v-carousel-item
              v-for="(slide, i) in 2"
              :key="i"
            >
              <v-img
                height="200"
                src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
                cover
                lazy-src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
              >
                <div
                  class="d-flex fill-height align-end pa-4"
                  style="
                    background: linear-gradient(
                      to top,
                      rgba(0, 0, 0, 0.2) 20%,
                      transparent
                    );
                  "
                >
                  <div class="text-white text-subtitle-2 truncate-2">
                    这里是轮播图的标题，可能会很长，需要进行两行截断显示，多余的部分会变成省略号...
                  </div>
                </div>
              </v-img>
            </v-carousel-item>
          </v-carousel>
        </SidebarSection>

        <SidebarSection title="热门人物">
          <v-sheet>
            <v-row class="mt-2">
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
                  <v-img
                    src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
                  />
                </v-avatar>
                <div class="text-caption">名字</div>
                <div class="text-grey text-caption">所属栏目</div>
              </v-col>
            </v-row>
          </v-sheet>
        </SidebarSection>

        <SidebarSection title="热门专题">
          <v-card elevation="0">
            <v-img
              class="mx-4"
              src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
              height="160"
              cover
              lazy-src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
            />
            <v-card-text>
              <div class="text-subtitle-2 truncate-2">
                所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目
                所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目
                所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目
                所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目所属栏目....
              </div>
              <v-divider class="my-4"></v-divider>
              <v-list
                class="bullet-list pa-0"
                density="compact"
              >
                <v-list-item
                  v-for="tag in ['标签1', '标签2', '标签3']"
                  :key="tag"
                  min-height="30"
                >
                  <v-list-item-title class="text-caption">
                    {{ tag }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </SidebarSection>

        <SidebarSection title="热门标签">
          <v-card
            elevation="0"
            variant="flat"
          >
            <v-list
              lines="two"
              class="py-0 overflow-y-auto"
              max-height="400"
            >
              <v-list-item
                v-for="(comment, index) in comments"
                :key="index"
                class="px-4 py-3"
              >
                <template v-slot:default>
                  <div class="d-flex flex-column">
                    <v-sheet
                      class="text-body-2 mb-2 pa-2 rounded"
                      color="blue-lighten-5"
                    >
                      {{ comment.text }}
                    </v-sheet>
                    <div
                      class="d-flex align-center text-caption text-medium-emphasis justify-space-between mb-1 w-100"
                    >
                      <span class="font-weight-medium mr-3">
                        {{ comment.author }}
                      </span>
                      <span>{{ comment.date }}</span>
                    </div>
                    <div class="text-caption text-disabled pl-2">
                      评论文章：{{ comment.article }}
                    </div>
                  </div>
                  <v-divider
                    class="mt-4"
                    v-if="index < comments.length - 1"
                  ></v-divider>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
          <v-sheet
            class="pa-5 text-center my-4"
            color="blue-lighten-5"
          >
            广告位
          </v-sheet>
        </SidebarSection>
        <SidebarSection title="最新地址">
          <v-card
            elevation="0"
            class="pa-4"
          >
            <v-list
              class="pa-0"
              density="compact"
            >
              <v-list-item
                class="rounded-sm mb-2"
                bg-color="blue-lighten-5"
              >
                <v-list-item-title class="text-caption">
                  最新地址：
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    class="text-primary text-caption font-weight-medium"
                  >
                    https://www.google.com
                  </a>
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                class="rounded-sm mb-2"
                bg-color="blue-lighten-5"
              >
                <v-list-item-title class="text-caption">
                  备用地址：
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    class="text-primary text-caption font-weight-medium"
                  >
                    https://www.google.com
                  </a>
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                class="rounded-sm"
                color="primary"
                variant="tonal"
              >
                <v-list-item-title class="text-caption">
                  永久域名：
                  <a
                    href="https://www.example.com"
                    target="_blank"
                    class="text-primary text-caption font-weight-medium"
                  >
                    https://www.example.com
                  </a>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </SidebarSection>

        <SidebarSection title="社群主页防失联">
          <v-row
            justify="center"
            class="mt-2"
          >
            <v-sheet
              color="bg-none"
              class="py-3 d-flex ga-4 bg-none"
            >
              <v-icon
                icon="mdi-github"
                size="30"
              />

              <v-icon
                icon="mdi-email"
                size="30"
              />
              <v-icon
                icon="mdi-twitter"
                size="30"
              />
              <v-icon
                icon="mdi-gitlab"
                size="30"
              />
            </v-sheet>
          </v-row>
        </SidebarSection>

        <SidebarSection title="热门标签">
          <v-row
            class="px-2 pt-2 pb-4"
            dense
          >
            <v-chip
              v-for="tag in ['走后门', '教育公平', '医患关系']"
              :key="tag"
              size="small"
              class="ma-1"
              :color="tag === '教育公平' ? 'primary' : 'surface-variant'"
              variant="tonal"
            >
              {{ tag }}
            </v-chip>
          </v-row>
        </SidebarSection>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
  .bullet-list .v-list-item {
    :deep(.v-list-item-title::before) {
      content: "•";
      margin-right: 8px;
      color: currentColor;
    }
  }
</style>
