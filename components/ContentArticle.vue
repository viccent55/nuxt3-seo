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
  const { decryptImage } = useDecryption();

  const contentRef = ref<HTMLDivElement | any>(null);
  const loading = ref(false);

  const initImgAndVideo = async () => {
    loading.value = true;
    try {
      if (!props.content) return;
      // Parse content using DOMParser for images
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");

      // 🔹 decrypt images in parallel
      const images = Array.from(doc.querySelectorAll("img[data-lazy-src]"));
      await Promise.all(
        images.map(async (img: EmptyObjectType) => {
          const lazySrc = img.getAttribute("data-lazy-src");
          if (!lazySrc) return;
          console.log(lazySrc);
          try {
            const decrypted = await decryptImage(lazySrc); // use returned value per image
            if (decrypted) {
              img.removeAttribute("data-lazy-src");
              img.src = decrypted;
            }
          } catch (err) {
            console.error("Error decrypting image:", err);
          }
        })
      );

      // Insert the parsed & decrypted content into the container
      // contentRef.value.innerHTML = "";
      Array.from(doc.body.childNodes).forEach((node) => {
        contentRef.value?.appendChild(node);
      });

      // 🔹 handle videos in the inserted content
      const videos = contentRef.value?.querySelectorAll("video");
      if (videos && videos.length > 0) {
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
      }
    } catch (e) {
      console.error("initImgAndVideo error:", e);
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    initImgAndVideo();
    watch(
      () => props.content,
      () => {
        if (contentRef.value) {
          contentRef.value.innerHTML = "";
        }
        initImgAndVideo();
      }
    );
  });
</script>

<template>
  <div
    class="mt-5 text-body-1 article-content"
    style="max-width: 100%"
  >
    <!-- Raw/original content while decrypting -->
    <div
      v-show="loading"
      v-html="content"
    />

    <!-- Final decrypted content -->
    <div
      v-show="!loading"
      ref="contentRef"
    />
    <!-- Fallback if JS is disabled -->
    <noscript>
      <div v-html="content"></div>
    </noscript>
    <!-- end js disabled -->
  </div>
</template>

<style scoped lang="scss">
  .article-content {
    max-width: 100% !important;
    width: 100%;
    display: block;

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin-inline: auto;
    }
  }
</style>
