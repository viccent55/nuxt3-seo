<script setup lang="ts">
  defineProps({
    advert: {
      type: Object,
      required: true,
    },
    heightImage: {
      type: String || Number,
      default: "120px",
    },
    class: {
      type: String,
      default: () => "",
    },
    aspectRatio: {
      type: Number || String,
      default: "",
    },
  });
</script>

<template>
  <v-card
    flat
    elevation="0"
    :class="class"
  >
    <NuxtLink
      :to="advert?.url || '#'"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <Image
        :src="advert?.image"
        :alt="advert?.title"
        height="auto"
        contain
        :aspectRatio="aspectRatio"
      />
    </NuxtLink>
  </v-card>
</template>
