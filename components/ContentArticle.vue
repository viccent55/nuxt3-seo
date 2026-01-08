<script lang="ts" setup>
  const props = defineProps({
    content: {
      type: String,
      default: () => "",
    },
    skeleton: {
      type: Number,
      default: 4,
    },
    poster: {
      type: String,
      default: () => "",
    },
  });
  // your composable
  const { $hls } = useNuxtApp();
  const { decryptImage, decryptedImage } = useDecryption();

  const contentRef = ref<HTMLDivElement | any>(null);
  const loading = ref(false);
  const hlsInstances = ref<any[]>([]);

  const loadingContent = computed(() => {
    if (!props.content) return props.content;
    if (!process.client) return props.content; // SSR-safe
    if (!props.content) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(props.content, "text/html");

    // 🔥 PREVENT VIDEO FETCH DURING LOADING
    doc.querySelectorAll("video").forEach((video) => {
      const src = video.getAttribute("src");
      if (src) {
        video.setAttribute("data-src", src);
        video.removeAttribute("src");
        video.setAttribute("preload", "none");
      }
    });

    return doc.body.innerHTML;
  });

  const HLS_CONFIG = {
    // =============================
    // 🐢 Slow network optimizations
    // =============================
    manifestLoadingTimeOut: 15000,
    manifestLoadingMaxRetry: 3,
    manifestLoadingRetryDelay: 3000,

    levelLoadingTimeOut: 15000,
    levelLoadingMaxRetry: 3,
    levelLoadingRetryDelay: 3000,

    fragLoadingTimeOut: 20000,
    fragLoadingMaxRetry: 4,
    fragLoadingRetryDelay: 3000,

    // =============================
    // 🎥 Playback behavior
    // =============================
    startLevel: -1,
    capLevelToPlayerSize: true,
    enableWorker: true,

    // =============================
    // 🧠 Stability
    // =============================
    lowLatencyMode: false,
    backBufferLength: 30,
  };
  const initImgAndVideo = async (content: string) => {
    loading.value = true;
    try {
      if (!content) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      /* =============================
       * 🖼 Decrypt images
       * ============================= */
      const images = Array.from(doc.querySelectorAll("img[data-lazy-src]"));
      await Promise.all(
        images.map(async (img: EmptyObjectType) => {
          const lazySrc = img.getAttribute("data-lazy-src");
          if (!lazySrc) return;

          try {
            const decrypted = await decryptImage(lazySrc);
            if (decrypted) {
              img.removeAttribute("data-lazy-src");
              img.src = decrypted;
            }
          } catch (err) {
            console.error("Image decrypt failed:", err);
          }
        })
      );

      /* =============================
       * 📦 Mount DOM
       * ============================= */
      contentRef.value.innerHTML = "";
      Array.from(doc.body.childNodes).forEach((node) =>
        contentRef.value.appendChild(node)
      );

      /* =============================
       * 🎥 Handle videos
       * ============================= */
      const videos = contentRef.value.querySelectorAll("video");

      for (const video of videos) {
        if (video.dataset.hlsAttached === "true") continue;
        video.dataset.hlsAttached = "true";

        const src = video.getAttribute("src");
        if (!src) continue;

        // styles
        Object.assign(video.style, {
          display: "block",
          width: "100%",
          maxHeight: "400px",
          objectFit: "contain",
        });

        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata"; // ✅ IMPORTANT FIX

        /* ===== Poster ===== */
        if (props.poster && !video.poster) {
          const poster = await decryptImage(props.poster);
          if (poster) video.poster = poster;
        }

        /* =============================
         * 🍏 Safari native HLS
         * ============================= */
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          continue;
        }

        /* =============================
         * 🌍 HLS.js
         * ============================= */
        if (!$hls.isSupported()) continue;

        const hls = new $hls(HLS_CONFIG);
        hlsInstances.value.push(hls);

        let manifestTimeout = setTimeout(() => {
          console.error("⏱ HLS manifest timeout → destroy");
          hls.destroy();
        }, 20000);

        hls.attachMedia(video);

        hls.on($hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(src);
        });

        hls.on($hls.Events.MANIFEST_PARSED, () => {
          clearTimeout(manifestTimeout);
        });

        hls.on($hls.Events.ERROR, (_, data) => {
          if (!data.fatal) return;

          clearTimeout(manifestTimeout);

          switch (data.type) {
            case $hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case $hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        });
      }
    } catch (err) {
      console.error("initImgAndVideo error:", err);
    } finally {
      loading.value = false;
    }
  };

  onBeforeUnmount(() => {
    contentRef.value = null;
    hlsInstances.value.forEach((hls) => {
      hls.destroy();
    });
  });
  onMounted(() => {
    initImgAndVideo(props.content);
  });
  defineExpose({
    init: (content: string) => {
      initImgAndVideo(content);
    },
  });
</script>

<template>
  <div
    class="mt-5 text-body-1 article-content"
    style="max-width: 100%"
  >
    <div
      v-if="loading"
      v-html="loadingContent"
    />
    <div ref="contentRef" />
    <noscript><div v-html="loadingContent"></div></noscript>
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
