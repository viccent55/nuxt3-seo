<script lang="ts" setup>
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import ArticleList from "~/components/desktop/ArticleList.vue";
  import ArticleCard from "~/components/desktop/ArticleCard.vue";
  import SectionTitle from "~/components/desktop/SectionTitle.vue";
  import SidebarSection from "~/components/desktop/SidebarSection.vue";
  import AdvertSlot from "~/components/desktop/AdvertSlot.vue";
  import { useStore } from "~/store";

  const props = defineProps({
    subjects: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
    subjectsCard: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
    latests: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
    paginate: {
      type: Object as PropType<{ page: number; limit: number; total: number }>,
      default: () => ({ page: 1, limit: 10, total: 0 }),
    },
    comments: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
    postFilters: {
      type: Object as PropType<EmptyArrayType>,
      default: () => [],
    },
    actorFilters: {
      type: Object as PropType<EmptyArrayType>,
      default: () => [],
    },
    tagTops: {
      type: Object as PropType<EmptyArrayType>,
      default: [],
    },
    adverts: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
    basePath: {
      type: String,
      default: () => "/page_",
    },
  });

  const store = useStore();
  const emit = defineEmits(["page-change"]);
  const { formatTime } = useVariable();

  const getAdvertAtIndex = (index: number) => {
    const list = props.adverts.POSITION_HOME_LIST || [];
    if (!Array.isArray(list)) return null;
    return list.find((ad: any) => ad.position === index) || null;
  };

  const sideAds = computed(() => props.adverts.POSITION_HOME_RIGHT?.[0]);
  const { isMobile, route } = useVariable();
  const chunkedSubjects = computed(() => {
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < props?.subjects.length; i += chunkSize) {
      chunks.push(props.subjects.slice(i, i + chunkSize));
    }
    return chunks;
  });

  const gotoLatestSection = async () => {
    await nextTick();
    const element = document.getElementById("latest-articles");
    const header = document.querySelector(".v-app-bar");
    if (!element || !header) return;
    const offset = header.clientHeight;
    const elementPosition = element.offsetTop;
    const targetPosition = elementPosition - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };
  const displaySubject = computed(() => {
    // `/` or `/page_1`, `/page_2`, etc.
    return route.path === "/" || /^\/page_\d+$/.test(route.path);
  });
</script>
<template>
  <v-row>
    <!-- Main Content -->
    <v-col
      cols="12"
      md="8"
    >
      <!-- Latest topics -->
      <SectionTitle
        v-if="displaySubject"
        title="最新专题"
      />
      <section v-if="displaySubject">
        <v-carousel
          v-if="isMobile"
          :show-arrows="subjects.length > 2"
          hide-delimiters
          height="auto"
          class="mobile-carousel"
          cycle
        >
          <template v-slot:prev="{ props }">
            <v-btn
              density="compact"
              icon="mdi-chevron-left"
              variant="elevated"
              @click="props.onClick"
            />
          </template>
          <template v-slot:next="{ props }">
            <v-btn
              density="compact"
              icon="mdi-chevron-right"
              variant="elevated"
              @click="props.onClick"
            />
          </template>
          <v-carousel-item
            v-for="(chunk, index) in chunkedSubjects"
            :key="index"
          >
            <v-row>
              <v-col
                v-for="item in chunk"
                :key="item.id"
                cols="6"
              >
                <NuxtLink
                  :to="`/subject/${item.id}`"
                  class="text-decoration-none"
                >
                  <ArticleCard
                    cover
                    height="80"
                    class="cursor-pointer"
                    :item="item"
                  />
                </NuxtLink>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
        <!-- Desktop view - Grid -->
        <v-row
          v-else
          no-gutters
        >
          <v-col
            v-for="item in subjects"
            :key="item.id"
            sm="4"
            md="3"
          >
            <NuxtLink
              :to="`/subject/${item.id}`"
              class="text-decoration-none"
            >
              <ArticleCard
                height="120px"
                cover
                class="cursor-pointer"
                :item="item"
              />
            </NuxtLink>
          </v-col>
        </v-row>
      </section>

      <!-- Latest text -->
      <SectionTitle
        title="最新文章"
        id="latest-articles"
      />
      <v-sheet color="transparent">
        <div v-if="latests.length">
          <template
            v-for="(item, index) in latests"
            :key="'latest-' + index"
          >
            <!-- Article -->
            <NuxtLink
              :to="`/article/${item.id}`"
              @click.stop
              class="text-decoration-none"
            >
              <ArticleList
                :item="item"
                class="cursor-pointer"
              />
            </NuxtLink>

            <v-divider class="my-3 mx-2"></v-divider>

            <!-- Inject advert if 'sort' matches current index -->
            <template v-if="getAdvertAtIndex(index)">
              <div class="my-4 text-center">
                <AdvertSlot :advert="getAdvertAtIndex(index)" />
              </div>
            </template>
          </template>
        </div>
        <template v-else>
          <div class="text-center pa-10">加载中或暂无内容...</div>
        </template>
      </v-sheet>

      <!-- <Pagination /> -->
      <div class="text-center mt-4">
        <DesktopPaginate
          :page="paginate.page"
          :total="paginate.total"
          :limit="paginate.limit"
          :basePath="basePath"
          @page-change="
            (v: number) => {
              gotoLatestSection();
            }
          "
        />
      </div>
      <v-row class="mt-2">
        <v-col
          cols="12"
          md="6"
          v-for="(item, index) in store.advertisement?.POSITION_HOME_BOTTOM"
          :key="index"
        >
          <DesktopAdvertSlot :advert="item" />
        </v-col>
      </v-row>
    </v-col>

    <!-- Sidebar -->
    <v-col
      cols="12"
      md="4"
    >
      <SidebarSection
        title="推荐文章"
        :more="false"
        class="d-none d-sm-block"
      >
        <v-sheet class="pa-3">
          <template
            v-for="(item, index) in postFilters"
            :key="index"
          >
            <ArticleListItem
              :item="item"
              class="pa-2"
              :to="'/article/' + item.id"
            />
            <v-divider
              class="my-2"
              v-if="index < postFilters.length - 1"
            ></v-divider>
          </template>
        </v-sheet>
      </SidebarSection>

      <SidebarSection
        title="热门人物"
        :goto="actorFilters?.length > 0 ? `/actor/${actorFilters[0].id}` : ''"
        class="d-none d-sm-block"
      >
        <v-card
          flat
          class="pa-2"
        >
          <v-row>
            <v-col
              v-for="(item, index) in actorFilters"
              :key="index"
              cols="4"
              class="text-center cursor-pointer"
            >
              <NuxtLink
                :to="`/actor/${item.id}`"
                class="text-decoration-none text-surface-variant"
              >
                <v-avatar
                  size="45"
                  class="mb-1"
                >
                  <Image :src="item.avatar" />
                </v-avatar>
                <div class="text-caption truncate-1">
                  {{ item.name }}
                </div>
                <div class="text-grey text-caption text-xs truncate-2">
                  {{ item.intro }}
                </div>
              </NuxtLink>
            </v-col>
          </v-row>
        </v-card>
      </SidebarSection>
      <SidebarSection
        title="热门专题"
        :goto="subjectsCard?.length > 0 ? `/subject/${subjectsCard[0].id}` : ''"
        class="d-none d-sm-block"
      >
        <DesktopActorCard :items="subjectsCard" />
      </SidebarSection>

      <SidebarSection :more="false">
        <v-card elevation="0">
          <DesktopAdvertSlot :advert="sideAds" />
        </v-card>
      </SidebarSection>

      <SidebarSection
        title="热门评论"
        :more="false"
        class="d-none d-sm-block"
      >
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
                      {{ comment.member?.nickname || comment.member?.username }}
                    </span>
                    <span>{{ formatTime(comment.created) }}</span>
                  </div>
                  <div class="text-caption text-disabled pl-2">
                    评论文章：{{ comment.post?.title }}
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
      </SidebarSection>
      <SidebarSection
        title="最新地址"
        :more="false"
      >
        <v-card
          elevation="0"
          class="pl-md-4 pl-2 pt-4 pb-4"
        >
          <v-list
            class="pa-0"
            density="compact"
          >
            <v-list-item
              class="rounded-sm"
              bg-color="blue-lighten-5"
            >
              <v-list-item-title class="text-caption">
                最新地址：
                <a
                  :href="store.configuration?.website_url"
                  target="_blank"
                  class="text-primary text-caption font-weight-medium text-pre-wrap"
                >
                  {{ store.configuration?.website_url }}
                </a>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              class="rounded-sm"
              bg-color="blue-lighten-5"
            >
              <v-list-item-title class="text-caption">
                备用地址：
                <a
                  :href="store.configuration?.latest_url"
                  target="_blank"
                  class="text-primary text-caption font-weight-medium text-pre-wrap"
                >
                  {{ store.configuration?.latest_url }}
                </a>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              class="rounded-sm"
              color="primary"
            >
              <v-list-item-title class="text-caption">
                永久域名：
                <a
                  :href="store.configuration?.backup_url"
                  target="_blank"
                  class="text-primary text-caption font-weight-medium text-pre-wrap"
                >
                  {{ store.configuration?.backup_url }}
                </a>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              class="rounded-sm"
              color="primary"
            >
              <v-list-item-title class="text-caption">
                防失联邮箱：
                <a
                  :href="store.configuration?.email"
                  target="_blank"
                  class="text-primary text-caption font-weight-medium text-pre-wrap"
                >
                  {{ store.configuration?.email }}
                </a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-row
            justify="center"
            class="mt-2"
          >
            <v-sheet
              color="bg-none"
              class="pb-4 d-flex ga-2 bg-none"
            >
              <v-btn
                variant="text"
                icon="mdi-github"
                :to="store.configuration?.github"
                target="_blank"
                rel="noopener noreferrer"
              ></v-btn>
              <v-btn
                variant="text"
                icon="mdi-twitter"
                :to="store.configuration?.twitter"
                target="_blank"
                rel="noopener noreferrer"
              ></v-btn>
              <v-btn
                variant="text"
                icon="mdi-gitlab"
                :to="store.configuration?.gitlab"
                target="_blank"
                rel="noopener noreferrer"
              ></v-btn>
            </v-sheet>
          </v-row>
        </v-card>
      </SidebarSection>

      <SidebarSection
        title="热门标签"
        :goto="tagTops?.length > 0 ? `/tag/${tagTops[0].id}` : ''"
        class="d-none d-sm-block"
      >
        <v-row
          class="px-2 pt-2 pb-4"
          dense
        >
          <v-chip
            v-for="(tag, index) in tagTops"
            :key="index"
            size="small"
            class="ma-1"
            color="surface-variant"
            variant="tonal"
            :to="'/tag/' + tag.id"
          >
            {{ tag.name }}
          </v-chip>
        </v-row>
      </SidebarSection>
    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
  .mobile-carousel-container {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 30px; /* Space for arrows */
  }

  .mobile-slide-group {
    flex: 1;
    padding: 8px 0;
  }

  .slide-item {
    padding: 0 8px;
    width: 50vw; /* Show 2 items by default */
  }

  .carousel-arrow {
    position: absolute;
    z-index: 1;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
</style>
