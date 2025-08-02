<script lang="ts" setup>
  import Hls from "hls.js";

  const props = defineProps({
    content: {
      type: String,
      default: () => "",
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
      for (const video of videos) {
        const src = video.getAttribute("src");
        if (src && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hlsInstances.value.push(hls);
        }
      }
    }
  };
  // Watch for changes in the article detail
  watchEffect(async () => {
    if (props.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");
      // Decrypt images
      const images = doc.querySelectorAll("img[data-lazy-src]");
      for (const img of <any>images) {
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
  });

  watch(decryptedContent, async () => {
    await nextTick();
    initHlsForVideos();
  });
  onBeforeUnmount(() => {
    hlsInstances.value.forEach((hls) => hls.destroy());
  });
</script>
<template>
  <div
    ref="contentRef"
    class="mt-5 text-body-1 article-content"
    style="max-width: 100%"
    v-html="decryptedContent"
  ></div>
</template>
