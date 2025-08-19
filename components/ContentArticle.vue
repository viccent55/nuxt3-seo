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

      // Parse content using DOMParser for images
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");

      // 🔹 decrypt images in parallel
      const images = Array.from(doc.querySelectorAll("img[data-lazy-src]"));
      await Promise.all(
        images.map(async (img: EmptyObjectType) => {
          const lazySrc = img.getAttribute("data-lazy-src");
          if (!lazySrc) return;

          try {
            const decrypted = await decryptImage(lazySrc); // use returned value per image
            if (decrypted) {
              img.src = decrypted;
              img.removeAttribute("data-lazy-src");
            }
          } catch (err) {
            console.error("Error decrypting image:", err);
          }
        })
      );

      // Insert the parsed & decrypted content into the container
      contentRef.value.innerHTML = "";
      Array.from(doc.body.childNodes).forEach((node) => {
        contentRef.value?.appendChild(node);
      });

      // 🔹 handle videos in the inserted content
      const videos = contentRef.value.querySelectorAll("video");
      videos.forEach((video: HTMLVideoElement) => {
        video.style.display = "block";
        video.style.width = "100%";

        const src = video.getAttribute("src");
        if (!src) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src; // Safari native
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
