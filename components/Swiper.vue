<script setup lang="ts">
  import { ref, defineAsyncComponent } from "vue";
  import Image from "@/components/Image.vue";
  import { useDisplay } from "vuetify";

  const VideoPlayer = defineAsyncComponent(
    () => import("@/components/Video.vue")
  );

  defineProps({
    mediaInfo: {
      type: Array as PropType<{ name: string; value: string }[]>,
      default: () => [],
    },
    height: {
      type: String,
      default: () => "100%",
    },
  });

  const videoPlayerRef = ref<InstanceType<typeof VideoPlayer>[]>([]);
  const carousel = ref();

  const closeVideo = () => {
    videoPlayerRef.value.forEach((player) => {
      player?.closeVideo?.();
    });
  };

  const next = () => carousel.value?.next?.();
  const prev = () => carousel.value?.prev?.();
  const { smAndDown } = useDisplay();
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    if (!isNative.value) {
      if (smAndDown.value) {
        return "calc(35vh - 30px)";
      } else {
        return `calc(100vh - 120px)`;
      }
    }
    return "250px";
  });
  defineExpose({
    closeVideo,
    next,
    prev,
  });
</script>

<template>
  <v-carousel
    ref="carousel"
    class="swiper"
    hide-delimiter-background
    :hide-delimiters="mediaInfo?.length <= 1"
    :show-arrows="mediaInfo?.length > 1"
    height="100%"
    color="primary"
  >
    <template #prev="{ props }">
      <v-btn
        variant="tonal"
        color="primary"
        density="compact"
        icon="mdi-chevron-left"
        @click="props.onClick"
      ></v-btn>
    </template>
    <template #next="{ props }">
      <v-btn
        variant="tonal"
        color="primary"
        density="compact"
        icon="mdi-chevron-right"
        @click="props.onClick"
      ></v-btn>
    </template>
    <v-carousel-item
      v-for="(item, index) in mediaInfo"
      :key="index"
      class="fill-height"
    >
      <Image
        v-if="item.name === 'image'"
        :src="item?.value"
        :cover="false"
        class="media"
        :style="{
          maxHeight: height,
        }"
      />
      <VideoPlayer
        v-else-if="item.name === 'video'"
        ref="videoPlayerRef"
        :src="item.value"
        class="video"
        :style="{
          maxHeight: height,
        }"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped lang="scss">
  .swiper {
    width: 100%;
    max-height: calc(v-bind(heightOffset));
    // min-height: 300px;
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
    // height: 100%;
    object-fit: contain;
    min-height: 200px;
  }
  .video {
    width: 100%;
    height: 100%;
  }
</style>
