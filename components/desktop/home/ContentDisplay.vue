<script lang="ts" setup>
  import ArticleListItem from "~/components/desktop/ArticleListItem.vue";
  import ArticleList from "~/components/desktop/ArticleList.vue";
  import ArticleCard from "~/components/desktop/ArticleCard.vue";
  import SectionTitle from "~/components/desktop/SectionTitle.vue";
  import SidebarSection from "~/components/desktop/SidebarSection.vue";
  import AdvertSlot from "~/components/desktop/AdvertSlot.vue";
  import { useGoTo } from "vuetify/lib/composables/goto.mjs";

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
  });

  const getAdvertAtIndex = (index: number) => {
    const list = props.adverts.POSITION_HOME_LIST || [];
    if (!Array.isArray(list)) return null;
    return list.find((ad: any) => ad.position === index) || null;
  };

  const emit = defineEmits(["page-change"]);
  const sideAds = computed(() => props.adverts.POSITION_HOME_RIGHT?.[0]);
  const { isMobile } = useVariable();
  const chunkedSubjects = computed(() => {
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < props?.subjects.length; i += chunkSize) {
      chunks.push(props.subjects.slice(i, i + chunkSize));
    }
    return chunks;
  });

  const gotoLatestSection = () => {
    const element = document.getElementById("latest-articles");

    // 2. Find your fixed header element.
    // Replace '.v-app-bar' with the actual class or ID of your header component.
    const header = document.querySelector(".v-app-bar");

    // Check if both elements exist
    if (element && header) {
      // 3. Calculate the target scroll position.
      // We subtract the header's height to prevent it from being hidden.
      const offset = header.clientHeight;
      const elementPosition = element.offsetTop;
      const targetPosition = elementPosition - offset;

      // 4. Use window.scrollTo to perform the scroll with the new position.
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };
</script>
<template>
  <v-row>
    <!-- Main Content -->
    <v-col
      cols="12"
      md="8"
    >
      <!-- Latest topics -->
      <SectionTitle title="最新专题" />
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
                :to="'/subject/detail/' + item.id"
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
            :to="'/subject/detail/' + item.id"
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
          @update:page="
            (v) => {
              emit('page-change', v);
              gotoLatestSection();
            }
          "
        />
      </div>
    </v-col>

    <!-- Sidebar -->
    <v-col
      cols="12"
      md="4"
      class="d-none d-sm-block"
    >
      <SidebarSection title="推荐文章">
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

      <!-- <SidebarSection title="活动参与">
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
      </SidebarSection> -->
      <SidebarSection title="热门人物">
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
                :to="`/actor/detail/${item.id}`"
                class="text-decoration-none"
              >
                <v-avatar
                  size="45"
                  class="mb-1"
                >
                  <Image :src="item.avatar" />
                </v-avatar>
                <div class="text-caption truncate-1 text-black">
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
      <SidebarSection title="热门专题">
        <DesktopActorCard :items="subjectsCard" />
      </SidebarSection>

      <SidebarSection :more="false">
        <v-card elevation="0">
          <DesktopAdvertSlot :advert="sideAds" />
        </v-card>
      </SidebarSection>

      <SidebarSection title="热门评论">
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
            v-for="(tag, index) in tagTops"
            :key="index"
            size="small"
            class="ma-1"
            color="surface-variant"
            variant="tonal"
            :to="'/article/' + tag.id"
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
