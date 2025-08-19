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

  // your composable
  const { decryptImage, decryptedImage } = useDecryption();

  const contentRef = ref<HTMLDivElement | null>(null);
  const loading = ref(false);

  const initImgAndVideo = async () => {
    loading.value = true;
    try {
      if (!props.content || !contentRef.value) return;
      // put raw content into container
      contentRef.value.innerHTML = props.content;

      const images = Array.from(
        contentRef.value.querySelectorAll("img[data-lazy-src]")
      );

      await Promise.all(
        images.map(async (img) => {
          const lazySrc = img.getAttribute("data-lazy-src");
          if (!lazySrc) return;

          try {
            // get the decrypted value for this image individually
            const decrypted = await decryptImage(lazySrc);
            if (decrypted) {
              img.setAttribute("src", decrypted);
            }
          } catch (err) {
            console.error("Error decrypting image:", err);
          }
        })
      );

      // 🔹 handle videos
      const videos = contentRef.value.querySelectorAll("video");
      videos.forEach((video: HTMLVideoElement) => {
        video.style.display = "block";
        video.style.width = "100%";

        const src = video.getAttribute("src");
        if (!src) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native
          video.src = src;
        } else if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        }
      });
    } catch (e) {
      console.error("initImgAndVideo error:", e);
    } finally {
      loading.value = false;
    }
  };

  // re-run when content changes
  watchEffect(() => {
    initImgAndVideo();
  });
</script>

<template>
  <div
    ref="contentRef"
    class="mt-5 text-body-1 article-content"
    style="max-width: 100%"
  />
</template>
