<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  const { $hls } = useNuxtApp();

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "auto",
    },
  });

  const videoPlayer = ref<HTMLVideoElement | null>(null);
  let hls: any | null = null;
  const { isNative } = usePlatform();
  const initializePlayer = () => {
    // Clean up existing HLS instance if it exists
    if (hls) {
      hls.destroy();
      hls = null;
    }
    const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(props.src)}`;
    if ($hls.isSupported() && videoPlayer.value) {
      hls = new $hls();
      hls.loadSource(isNative.value ? proxyUrl : props.src);
      hls.attachMedia(videoPlayer.value);

      // Autoplay logic
      hls.on($hls.Events.MANIFEST_PARSED, () => {
        if (props.autoplay) {
          videoPlayer.value?.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        }
      });

      // Error handling
      hls.on($hls.Events.ERROR, (event: any, data: any) => {
        if (data.fatal) {
          switch (data.type) {
            case $hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error. Retrying...");
              hls?.startLoad();
              break;
            case $hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error. Recovering...");
              hls?.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable HLS error", data);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (
      videoPlayer.value &&
      videoPlayer.value.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Native HLS (Safari)
      videoPlayer.value.src = props.src;
      videoPlayer.value.addEventListener(
        "loadedmetadata",
        () => {
          if (props.autoplay) {
            videoPlayer.value?.play().catch((error) => {
              console.error("Autoplay failed:", error);
            });
          }
        },
        { once: true }
      );
    } else {
      console.error("HLS is not supported in this browser.");
    }
  };

  onMounted(() => {
    if (props.src) {
      initializePlayer();
    }
  });

  // Re-initialize if src changes
  watch(
    () => props.src,
    (newSrc) => {
      if (newSrc) {
        initializePlayer();
      }
    }
  );
  const closeVideo = () => {
    // Stop video playback
    if (videoPlayer.value) {
      videoPlayer.value.pause();
      videoPlayer.value.removeAttribute("src");
      videoPlayer.value.load();
    }
    // Destroy HLS instance if it exists
    if (hls) {
      hls.destroy();
      hls = null;
    }
  };
  const displayHeight = computed(() => props.height);
  defineExpose({
    closeVideo,
  });
  onBeforeUnmount(() => {
    if (hls) {
      hls.destroy();
    }
  });
</script>

<template>
  <div class="video-container">
    <video
      ref="videoPlayer"
      class="video-js"
      controls
      :muted="props.muted"
      :autoplay="props.autoplay"
      playsinline
    ></video>
  </div>
</template>

<style scoped lang="scss">
  .video-container {
    width: 100%;
    /* height: 100%; */
    margin: auto;
  }
  .video-js {
    width: 100%;
    height: v-bind(displayHeight);
    object-fit: contain;
  }
</style>
