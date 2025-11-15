<template>
  <div class="gallery-container">
    <!-- Gallery Title -->
    <!-- <h2 class="gallery-title">{{ title }}</h2> -->

    <!-- Responsive Gallery Grid -->
    <!-- <div class="gallery-grid">
      <div
        v-for="(src, index) in decryptedSources"
        :key="index"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img
          :src="src"
          alt="Gallery Image"
          class="gallery-image"
        />
      </div>
    </div> -->

    <!-- FsLightbox Component -->
    <FsLightbox
      v-if="decryptedSources.length > 0"
      :toggler="toggler"
      :sources="decryptedSources"
      :slide="currentSlide + 1"
      class="fslightbox-source"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import FsLightbox from "fslightbox-vue";

  const props = defineProps({
    title: {
      type: String,
      default: "My Gallery",
    },
    sources: {
      type: Array,
      required: true,
    },
  });

  // Lightbox control state
  const toggler = ref(false);
  const currentSlide = ref(0);
  const decryptedSources = ref<string[]>([]);

  // The useDecryption composable seems to return a new decrypted URL on each call.
  // We'll create a local instance of it.
  const { decryptImage, decryptedImage } = useDecryption();

  watchEffect(async () => {
    if (props.sources && props.sources.length > 0) {
      const promises = props.sources.map(async (src: any) => {
        await decryptImage(src);
        return decryptedImage.value;
      });
      decryptedSources.value = await Promise.all(promises);
    }
  });

  const openLightbox = async (index: number) => {
    currentSlide.value = index;
    toggler.value = !toggler.value; // toggler must change to re-open lightbox
    await nextTick();
  };
  defineExpose({
    open: (index: number) => openLightbox(index),
  });
</script>

<style scoped>
  .fslightbox-container {
    padding-top: var(--safe-area-inset-top, 0px);
    padding-bottom: var(--safe-area-inset-bottom, 0px);
  }
  .gallery-container {
    padding: 1rem;
    max-width: 1200px;
    margin: auto;
  }

  .gallery-title {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
  }

  /* Responsive Grid */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .gallery-item {
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .gallery-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Mobile Responsiveness */
  @media (max-width: 600px) {
    .gallery-title {
      font-size: 1.4rem;
    }

    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>
