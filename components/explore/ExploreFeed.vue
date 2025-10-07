<script setup lang="ts">
  import { PERMISSION } from "@/common/permision";
  import Avatar from "@/components/Avatar.vue";
  import Heart from "@/components/global/Heart.vue";
  import Image from "@/components/Image.vue";
  import { checkPermissions } from "@/hooks/usePermisions";
  import type { PropType } from "vue";
  import { like } from "@/service/explore";

  defineProps({
    feed: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
  });

  const onClickLike = async (feed: EmptyObjectType) => {
    checkPermissions(PERMISSION.User, () => {
      like(feed.id).then((res) => {
        if (res.errcode === 0) {
          feed.isLike = !feed.isLike;
          feed.like_count += feed.isLike ? 1 : -1;
        }
      });
    });
  };

  defineEmits(["click", "clickAuthor"]);
</script>

<template>
  <v-card
    class="feed-wrapper position-relative"
    elevation="0"
    rounded="lg"
    @click="$emit('click')"
  >
    <!-- Media Section -->
    <div
      class="position-absolute"
      style="z-index: 10; right: 10px; top: 10px"
    >
      <v-icon
        v-if="feed.mode === 1"
        icon="mdi-play-circle-outline"
        size="24"
        color="primary"
      />
      <v-icon
        v-if="feed.mode === 2"
        icon="mdi-image-outline"
        size="24"
        color="primary"
      />
      <div
        v-if="feed.mode === 3"
        class="ad-badge"
      >
        广告
      </div>
    </div>
    <Image
      :src="feed.cover"
      cover
      :aspect-ratio="feed.cover_w / feed.cover_h"
    />

    <!-- Info Section -->
    <v-card-text class="pt-3">
      <!-- Title -->
      <div class="text-body-2 font-medium mb-2">
        {{ feed.title }}
      </div>

      <!-- Author + Like -->
      <div class="d-flex justify-space-between align-center">
        <!-- Author -->
        <div
          class="d-flex align-center cursor-pointer"
          @click.stop="$emit('clickAuthor')"
        >
          <Avatar
            :src="feed.author?.avatar"
            :id="feed.id"
            size="24"
          />
          <span class="text-caption ml-2">
            {{ feed.author?.name || feed.author?.nickname }}
          </span>
        </div>

        <!-- Like -->
        <div
          class="d-flex align-center cursor-pointer"
          @click.stop="onClickLike(feed)"
        >
          <Heart :class="{ 'text-red': feed.isLike }" />
          <span class="text-caption ml-1">{{ feed.like_count }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .feed-wrapper {
    cursor: pointer;
    transition: filter 0.2s;
  }
  .feed-wrapper:hover {
    filter: brightness(85%);
  }
  .ad-badge {
    position: absolute;
    right: 0;
    z-index: 10;
    font-size: 12px; /* text-xs */
    font-weight: 600; /* font-semibold */
    padding: 2px 8px; /* px-2 py-0.5 (≈0.125rem * base 16 = 2px) */
    border-radius: 9999px; /* rounded-full */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* shadow */
    animation: bounce 1s infinite; /* animate-bounce */
    background-color: rgb(var(--v-theme-primary));
    color: white;
    display: inline-block;
  }

  /* Bounce animation similar to Tailwind's animate-bounce */
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
</style>
