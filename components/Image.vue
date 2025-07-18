<script lang="ts" setup>
  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "160px",
    },
  });

  const emit = defineEmits(["imageDimensions"]);
  const { decryptImage, decryptedImage } = useDecryption();
  watchEffect(() => {
    if (props.src) {
      decryptImage(props.src);
    }
  });

  const state = reactive({
    width: 0,
    height: 0,
    isVertical: false,
  });
  const handleImageLoad = (src: string | undefined) => {
    if (!src) return;
    const img = document.querySelector(
      `img[src="${src}"]`
    ) as HTMLImageElement | null;
    if (img) {
      state.width = img.naturalWidth;
      state.height = img.naturalHeight;
      // Determine if the image is vertical or horizontal
      state.isVertical = state.height > state.width;
      emit("imageDimensions", state);
    }
  };
</script>
<template>
  <v-img
    v-if="decryptedImage"
    :lazy-src="decryptedImage"
    :src="decryptedImage"
    alt="Loading image..."
    :width="width"
    :height="height"
    @load="handleImageLoad"
  >
    <template v-slot:placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey-lighten-4"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>
    <slot />
  </v-img>

  <v-img
    v-else
    lazy-src="public/images/no-image.webp"
    src="public/images/no-image.webp"
    alt="Loading image..."
    :height="height"
    :width="width"
  >
    <template v-slot:placeholder>
      <div class="d-flex align-center justify-center fill-height">
        No image...
      </div>
    </template>
    <slot />
  </v-img>
</template>
