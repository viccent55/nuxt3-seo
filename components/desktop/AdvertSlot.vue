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
  });
</script>

<template>
  <v-card
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
      />
    </NuxtLink>
  </v-card>
</template>
