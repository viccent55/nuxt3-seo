<script lang="ts" setup>
  import ActorProfile from "./ActorProfile.vue";
  import { useTimeAgo, useElementSize } from "@vueuse/core";

  defineProps({
    item: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
    routeParam: {
      type: String,
      default: () => "",
    },
  });

  const articleCard = ref(null);
  const imageDimensions = ref();
  const getStyleImage = (item: EmptyObjectType) => {
    return {
      minWidth: item?.isVertical ? "100%" : cardWidth.value / 1.8 + "px",
      zIndex: 10,
      display: "block",
      objectFit: "contain",
      height: "auto",
    };
  };

  const router = useRouter();
  const isMobile = ref(false);

  const { width: cardWidth } = useElementSize(articleCard);

  // Check for mobile on mount and when window resizes
  onMounted(() => {
    // You can now access the card's width via the reactive `cardWidth` ref.
    console.log("Card width is:", cardWidth.value);
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", checkMobile);
  });

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };
</script>

<template>
  <v-sheet color="transparent">
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <v-card
        ref="articleCard"
        v-bind="hoverProps"
        :class="[
          'd-flex mb-2 position-relative',
          isMobile ? 'flex-column' : '',
          isHovering ? 'bg-default' : 'bg-none',
        ]"
        tag="article"
        flat
      >
        <v-avatar
          :class="item?.cover ? 'image-container' : 'no-image'"
          class="ma-sm-3"
          rounded="0"
          size="160"
        >
          <Image
            :class="!isMobile ? 'article-image' : ''"
            :src="item?.cover"
            @image-dimensions="(v) => (imageDimensions = v)"
            :style="isHovering ? getStyleImage(imageDimensions) : {}"
            contain
          />
          <v-chip
            v-if="item?.cover"
            class="chip-top-left"
            color="primary"
            variant="flat"
            label
            rounded="0"
            size="x-small"
          >
            文章分类
          </v-chip>
        </v-avatar>

        <v-card-text
          class="text-content"
          v-if="isMobile"
        >
          <h3 class="truncate-1">{{ item?.title }}</h3>
          <v-row
            no-gutters
            class="mt-1"
            align="center"
          >
            <v-col>
              <v-row
                dense
                class="text-caption text-grey"
              >
                <v-col cols="6">
                  <div class="d-flex ga-2 align-center">
                    <div>
                      {{ useTimeAgo(item?.created) }}
                    </div>
                    <div class="d-flex ga-2">
                      <v-icon>mdi-eye</v-icon>
                      <span>{{ item?.view_count }}</span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex ga-2 align-center">
                    <div class="d-flex ga-2">
                      <v-icon>mdi-chat-outline</v-icon>
                      <span>{{ item?.comment_count }}</span>
                    </div>
                    <div class="d-flex ga-2">
                      <v-icon>mdi-thumb-up-outline</v-icon>
                      <span>{{ item?.like_count }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <div class="scroll-x d-flex w-full">
                <div
                  class="d-flex align-center text-grey"
                  v-if="item?.actors?.length > 0"
                  v-for="author in item?.actors"
                  :key="author.id"
                >
                  <ActorProfile
                    :item="author"
                    :to="`/actor/detail/${author.id}`"
                    class="cursor-pointer"
                  />
                </div>
                <div
                  class="d-flex align-center text-grey"
                  v-if="item?.actors?.length > 0"
                  v-for="category in item?.categories"
                  :key="category.id"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-chip
                      v-bind="props"
                      size="x-small"
                      class="ma-1"
                      :class="isHovering ? '' : 'bg-none text-grey'"
                      :color="isHovering ? 'primary' : ''"
                      @click.stop
                      flat
                      :to="`/category-${category.id}`"
                    >
                      {{ category.name }}
                    </v-chip>
                  </v-hover>
                </div>
                <div
                  class="d-flex align-center text-grey"
                  v-if="item?.subjects.length > 0"
                  v-for="subject in item?.subjects"
                  :key="subject.id"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-chip
                      v-bind="props"
                      size="x-small"
                      class="ma-1"
                      :class="isHovering ? '' : 'bg-none text-grey'"
                      :color="isHovering ? 'primary' : ''"
                      @click.stop
                      flat
                      :to="`/subject/detail/${subject.id}`"
                    >
                      {{ subject.name }}
                    </v-chip>
                  </v-hover>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text
          class="text-content"
          v-else
        >
          <div>
            <h3 class="truncate-1">{{ item?.title }}</h3>
            <div class="text-caption mt-1 text-grey truncatte-3">
              {{ item?.intro }}
            </div>
          </div>
          <v-row
            no-gutters
            class="mt-1"
            align="center"
          >
            <v-col :cols="isMobile ? 12 : 4">
              <v-row
                dense
                :justify="isMobile ? 'space-between' : 'start'"
                class="text-caption text-grey"
              >
                <v-col cols="12">
                  <div class="d-flex ga-4 align-center">
                    <div>
                      {{ useTimeAgo(item?.created) }}
                    </div>
                    <div class="d-flex ga-2">
                      <v-icon>mdi-eye</v-icon>
                      <span>{{ item?.view_count }}</span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex ga-4 align-center">
                    <div class="d-flex ga-2">
                      <v-icon>mdi-chat-outline</v-icon>
                      <span>{{ item?.comment_count }}</span>
                    </div>
                    <div class="d-flex ga-2">
                      <v-icon>mdi-thumb-up-outline</v-icon>
                      <span>{{ item?.like_count }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="isMobile ? 12 : 8">
              <v-row dense>
                <v-col
                  :cols="isMobile ? 12 : 6"
                  v-if="item?.tags?.length > 0"
                >
                  <template
                    v-for="(tag, index) in item?.tags"
                    :key="index"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-chip
                        v-bind="props"
                        size="x-small"
                        class="ma-1"
                        :class="isHovering ? '' : 'bg-none text-grey'"
                        :color="isHovering ? 'primary' : ''"
                        @click.stop
                        flat
                        :to="'/tag/detail/' + tag.id"
                      >
                        {{ tag.name }}
                      </v-chip>
                    </v-hover>
                  </template>
                </v-col>
                <v-col
                  :cols="isMobile ? 12 : 6"
                  v-if="item?.actors?.length > 0"
                >
                  <div
                    class="d-flex align-center text-grey"
                    v-for="author in item?.actors"
                    :key="author.id"
                  >
                    <ActorProfile
                      :item="author"
                      :to="`/actor/detail/${author.id}`"
                      class="cursor-pointer"
                    />
                  </div>
                </v-col>
                <v-col
                  :cols="isMobile ? 12 : 6"
                  v-if="item?.categories?.length > 0"
                >
                  <template
                    v-for="(category, index) in item?.categories"
                    :key="index"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-chip
                        v-bind="props"
                        size="x-small"
                        class="ma-1"
                        :class="isHovering ? '' : 'bg-none text-grey'"
                        :color="isHovering ? 'primary' : ''"
                        @click.stop
                        flat
                        :to="`/category-${category.id}`"
                      >
                        {{ category.name }}
                      </v-chip>
                    </v-hover>
                  </template>
                </v-col>

                <v-col
                  :cols="isMobile ? 12 : 6"
                  v-if="item?.subjects?.length > 0"
                >
                  <template
                    v-for="(subject, index) in item?.subjects"
                    :key="index"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-chip
                        v-bind="props"
                        size="x-small"
                        class="ma-1"
                        :class="isHovering ? '' : 'bg-none text-grey'"
                        :color="isHovering ? 'primary' : ''"
                        @click.stop
                        flat
                        :to="`/subject/detail/${subject.id}`"
                      >
                        {{ subject.name }}
                      </v-chip>
                    </v-hover>
                  </template>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-sheet>
</template>

<style scoped lang="scss">
  .chip-top-left {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 100;
    margin: 0;
    pointer-events: none;
  }

  .image-container {
    position: relative;
    overflow: visible !important;
    z-index: 1;
  }

  .article-image {
    position: absolute;
    top: 0;
    left: 0;

    transition: all 0.2s ease;
    object-fit: contain;
    z-index: 1;
  }

  .text-content {
    position: relative;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .position-relative {
    overflow: visible !important;
  }

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .v-avatar {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16/9;
    }

    .v-card {
      padding: 8px;
    }

    .text-content {
      padding: 8px !important;
    }

    .truncate-1 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .truncatte-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
