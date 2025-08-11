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
  const loading = ref(false);
  // Watch for changes in the article detail
  const initImgAndVideo = async () => {
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
        const videos = doc.querySelectorAll("video");
        // We create an array of promises, where each promise handles one video
        const videoPromises = Array.from(videos).map(async (video) => {
          const src = video.getAttribute("src");
          if (src && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
          }
        });
        // Wait for all promises to complete
        await Promise.all(videoPromises);
        decryptedContent.value = doc.body.innerHTML;
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
    }
  };
  watchEffect(() => {
    initImgAndVideo();
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
