<script setup lang="ts">
  import Image from "./Image.vue";

  defineProps({
    advert: {
      type: Object,
      required: true,
    },
    height: {
      type: String || Number,
      default: "120px",
    },
    width: {
      type: String || Number,
      default: "100%",
    },
    fit: {
      type: String,
      default: "cover",
    },
  });

  const emit = defineEmits<{
    (e: "allowClose", value: boolean): void;
  }>();
</script>

<template>
  <v-card
    elevation="0"
    style="padding: 0; background: transparent; border: none"
  >
    <a
      :href="advert?.url || '#'"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <Image
        :src="advert?.image"
        :alt="advert?.title"
        :width="width"
        :height="height"
        :fit="fit"
        @imageDimensions="emit('allowClose', true)"
      />
    </a>
  </v-card>
</template>
