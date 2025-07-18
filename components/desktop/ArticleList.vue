<script lang="ts" setup>
  import ActorProfile from "./ActorProfile.vue";

  const { dateStringTo24Hour } = useApp();
  const props = defineProps({
    item: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
  });
  const imageDimensions = ref();
  const getStyleImage = (item: EmptyObjectType) => {
    return {
      minWidth: item?.isVertical ? "100%" : item?.width / 2.8 + "px",
      zIndex: 10,
      display: "block",
      objectFit: "contain",
    };
  };
</script>
<template>
  <v-card
    class="d-flex mb-2 position-relative"
    tag="article"
  >
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <v-avatar
        v-bind="hoverProps"
        :class="item?.cover ? 'image-container' : 'no-image'"
        class="ma-3"
        rounded="0"
        size="160"
      >
        <div class="image-wrapper">
          <Image
            class="article-image"
            :src="item.cover"
            @image-dimensions="(v) => (imageDimensions = v)"
            :style="isHovering ? getStyleImage(imageDimensions) : {}"
            contain
          />
          <v-chip
            v-if="item.cover"
            class="chip-top-left"
            color="primary"
            variant="flat"
            label
            rounded="0"
            size="x-small"
          >
            New Tweets
          </v-chip>
        </div>
      </v-avatar>
    </v-hover>

    <v-card-text class="text-content">
      <div>
        <h3 class="truncate-1">{{ item.title }}</h3>
        <div class="text-caption mt-1 text-grey truncatte-3">
          {{ item.intro }}
        </div>
      </div>
      <v-row
        no-gutters
        class="mt-1"
        align="center"
      >
        <v-col cols="7">
          <v-chip
            v-for="(tag, index) in item.tags"
            :key="index"
            size="x-small"
            class="ma-1"
            color="primary"
            variant="tonal"
          >
            {{ tag.name }}
          </v-chip>
        </v-col>
        <v-col cols="5">
          <v-row
            dense
            justify="end"
            class="text-caption text-grey"
          >
            <div class="d-flex ga-3">
              <div>
                🕒
                {{ dateStringTo24Hour(item.created, "YYYY-DD-MM hh:mm") }}
              </div>
              <div class="d-flex ga-2 align-center">
                <v-icon>mdi-eye</v-icon>
                <span>{{ item.view_count }}</span>
              </div>
              <div class="d-flex ga-2 align-center">
                <v-icon>mdi-chat-outline</v-icon>
                <span>{{ item.comment_count }}</span>
              </div>
              <div class="d-flex ga-2 align-center">
                <v-icon>mdi-thumb-up-outline</v-icon>
                <span>{{ item.like_count }}</span>
              </div>
            </div>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          v-if="
            item.actors.length > 0 ||
            item.subjects.length > 0 ||
            item.categories.length > 0
          "
        >
          <v-row
            dense
            align="center"
          >
            <v-col v-if="item.actors.length > 0">
              <div
                class="d-flex align-center text-grey"
                v-for="author in item.actors"
                :key="author.id"
              >
                <ActorProfile :item="author" />
              </div>
            </v-col>
            <v-col v-if="item.categories.length > 0">
              <v-chip
                v-for="(category, index) in item.categories"
                :key="index"
                size="x-small"
                class="ma-1"
                variant="tonal"
              >
                {{ category.name }}
              </v-chip>
            </v-col>
            <v-col v-if="item.subjects.length > 0">
              <v-chip
                v-for="(subject, index) in item.subjects"
                :key="index"
                size="x-small"
                class="ma-1"
              >
                {{ subject.name }}
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
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

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }
  .article-image {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition: all 0.2s ease;
    object-fit: contain;
    z-index: 1;
  }

  .text-content {
    position: relative;
    padding-left: 5px; /* Add padding to prevent text overlap */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Ensure the card can contain the expanded image */
  .position-relative {
    overflow: visible !important;
  }
</style>
