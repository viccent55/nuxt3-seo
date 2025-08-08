<script lang="ts" setup>
  import Hls from "hls.js";

  const props = defineProps({
    content: {
      type: String,
      default: () => "",
    },
    skeleton: {
      type: Number,
      default: 4,
    },
  });
  const { decryptImage, decryptedImage } = useDecryption();
  const decryptedContent = ref("");
  const contentRef = ref<HTMLDivElement | null>(null);
  const hlsInstances = ref<Hls[]>([]);
  const initHlsForVideos = async () => {
    if (contentRef.value) {
      // Destroy previous instances to avoid memory leaks
      hlsInstances.value.forEach((hls) => hls.destroy());
      hlsInstances.value = [];

      const videos = contentRef.value.querySelectorAll("video");
      // Use Promise.all to handle all videos concurrently
      // We create an array of promises, where each promise handles one video
      const videoPromises = Array.from(videos).map(async (video) => {
        const src = video.getAttribute("src");
        if (src && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hlsInstances.value.push(hls);
        }
      });

      // Wait for all promises to complete
      await Promise.all(videoPromises);
    }
  };
  const loading = ref(false);
  // Watch for changes in the article detail
  const init = async () => {
    try {
      loading.value = true;
      if (props.content && typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(props.content, "text/html");
        // Decrypt images
        const images = doc.querySelectorAll("img[data-lazy-src]");
        if (images && images.length) {
          await Promise.all(
            Array.from(images).map(async (img: EmptyObjectType) => {
              const lazySrc = img.getAttribute("data-lazy-src");
              if (lazySrc) {
                try {
                  await decryptImage(lazySrc);
                  img.src = decryptedImage.value;
                } catch (error) {
                  console.error("Error decrypting image:", error);
                }
              } else {
                console.warn("Lazy source is undefined");
              }
            })
          );
        }
        // Decrypt videos
        // const videos = doc.querySelectorAll("video");
        // for (const video of videos) {
        //   const videoSrc = video.getAttribute("src");
        //   if (videoSrc) {
        //     await decryptImage(videoSrc);
        //     video.src = decryptedImage.value;
        //   }
        // }
        // Update decrypted content
        decryptedContent.value = doc.body.innerHTML;
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  };
  watch(
    () => props.content,
    async () => {
      await nextTick();
      init();
    }
  );

  watch(
    () => decryptedContent.value,
    async () => {
      await nextTick();
      initHlsForVideos();
    },
    { immediate: true }
  );
  onBeforeUnmount(() => {
    hlsInstances.value.forEach((hls) => hls.destroy());
  });
  onMounted(() => {
    init();
    initHlsForVideos();
  });
</script>
<template>
  <v-skeleton-loader
    v-if="loading"
    v-for="i in skeleton"
    :key="i"
    width="100%"
    height="16px"
    class="rounded-pill mb-5"
  />
  <div
    v-else
    ref="contentRef"
    class="mt-5 text-body-1 article-content"
    style="max-width: 100%"
    v-html="decryptedContent"
  ></div>
</template>
