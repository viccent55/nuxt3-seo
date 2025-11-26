<script lang="ts" setup>
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import ArticleList from "~/components/desktop/ArticleList.vue";
  import ArticleCard from "~/components/desktop/ArticleCard.vue";
  import SectionTitle from "~/components/desktop/SectionTitle.vue";
  import SidebarSection from "~/components/desktop/SidebarSection.vue";
  import AdvertSlot from "~/components/desktop/AdvertSlot.vue";
  import { useStore } from "~/store";
  import { useDisplay } from "vuetify";

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
      type: Object as PropType<EmptyArrayType>,
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

  const { route } = useVariable();
  const { smAndDown } = useDisplay();
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

  // 🧠 computed mix list: insert ad after every 3 latest
  const mixedList = computed(() => {
    const combined: any[] = [];
    let adIndex = 0;

    const latests = props.latests || [];
    const ads = props.adverts?.POSITION_HOME_LIST || [];

    latests.forEach((item, index) => {
      combined.push({ type: "latest", data: item });

      // every 3 latests, insert 1 ad (if available)
      if ((index + 1) % 3 === 0 && ads[adIndex]) {
        combined.push({
          type: "ad",
          data: ads[adIndex],
        });
        adIndex++;
      }
    });

    return combined;
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
          v-if="smAndDown"
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
                    contain
                    height="100"
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
        <div v-if="mixedList?.length">
          <template
            v-for="(item, index) in mixedList"
            :key="item.type + '-' + index"
          >
            <!-- 📰 Latest Article -->
            <template v-if="item.type === 'latest'">
              <NuxtLink
                :to="`/article/${item.data.id}`"
                @click.stop
                class="text-decoration-none"
              >
                <ArticleList
                  :item="item?.data"
                  class="cursor-pointer"
                />
              </NuxtLink>

              <v-divider class="my-3 mx-2" />
            </template>

            <!-- 📢 Advert -->
            <template v-else-if="item.type === 'ad'">
              <div class="my-4 text-center">
                <AdvertSlot
                  :advert="item.data"
                  class="latest-ads"
                  height-image="auto"
                />
              </div>
              <v-divider class="my-3 mx-2" />
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
      <v-row
        class="mt-2"
        dense
      >
        <v-col
          cols="12"
          md="12"
          v-for="(item, index) in store.advertisement?.POSITION_HOME_BOTTOM"
          :key="index"
        >
          <DesktopAdvertSlot
            :advert="item"
            class="home-button-ads"
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Sidebar -->
    <v-col
      cols="12"
      md="4"
    >
      <SocialNetwork />

      <SidebarSection
        v-if="actorFilters.length > 0"
        title="热门人物"
        :goto="actorFilters?.length > 0 ? `/actor` : ''"
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
      <SidebarSection :more="false">
        <v-card
          flat
          v-for="ads in props.adverts.POSITION_HOME_RIGHT"
          :key="ads.id"
        >
          <DesktopAdvertSlot
            :advert="ads"
            color="transparent"
            class="right-ads-ratio"
          />
        </v-card>
      </SidebarSection>
      <SidebarSection
        title="热门专题"
        :goto="subjectsCard?.length > 0 ? `/subject` : ''"
        class="d-none d-sm-block"
      >
        <DesktopActorCard :items="subjectsCard" />
      </SidebarSection>

      <SidebarSection
        title="推荐文章"
        :more="false"
        class="d-none d-sm-block"
        v-if="postFilters.length > 0"
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
                    评论文章：
                    <NuxtLink
                      class="text-disabled text-decoration-none"
                      :to="`/article/${comment.post_id}`"
                    >
                      {{ comment.post?.title }}
                    </NuxtLink>
                  </div>
                </div>
                <v-divider
                  class="mt-4"
                  v-if="index < comments?.length - 1"
                ></v-divider>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </SidebarSection>

      <SidebarSection
        title="热门标签"
        :goto="tagTops?.length > 0 ? `/tag` : ''"
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
  .home-button-ads {
    width: 100%;
    // max-width: 373px;
    // aspect-ratio: 373 / 78;
    object-fit: contain;
  }
  .right-ads-ratio {
    display: block;
    width: 100%;
    // max-width: 373px;
    aspect-ratio: 373 / 80;
    object-fit: contain;
  }
  .latest-ads {
    width: 100%;
  }
</style>
