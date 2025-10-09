<script setup lang="ts">
  import { ref, defineAsyncComponent, defineExpose } from "vue";
  import { useDisplay } from "vuetify"; // for screen size check
  import Image from "@/components/Image.vue";

  const VideoPlayer = defineAsyncComponent(
    () => import("@/components/Video.vue")
  );

  defineProps<{
    mediaInfo: Array<{ name: string; value: string }>;
  }>();

  const videoPlayerRef = ref<InstanceType<typeof VideoPlayer>[]>([]);
  const carousel = ref();

  const closeVideo = () => {
    videoPlayerRef.value.forEach((player) => {
      player?.closeVideo?.();
    });
  };

  const next = () => carousel.value?.next?.();
  const prev = () => carousel.value?.prev?.();

  defineExpose({
    closeVideo,
    next,
    prev,
  });

  const { mdAndUp } = useDisplay();
</script>

<template>
  <v-carousel
    ref="carousel"
    class="swiper"
    hide-delimiter-background
    :hide-delimiters="mediaInfo?.length <= 1"
    :show-arrows="mediaInfo?.length > 1"
    height="100%"
  >
    <v-carousel-item
      v-for="(item, index) in mediaInfo"
      :key="index"
      class="fill-height"
    >
      <div class="wrapper">
        <Image
          v-if="item.name === 'image'"
          :src="item?.value"
          :cover="false"
          class="media"
        />
        <VideoPlayer
          v-else-if="item.name === 'video'"
          ref="videoPlayerRef"
          :src="item.value"
          class="media"
        />
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped lang="scss">
  .swiper {
    width: 100%;
    max-height: 95vh;
    min-height: 300px;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .media {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
