<script setup lang="ts">
  defineProps({
    advert: {
      type: Object,
      required: true,
    },
    heightImage: {
      type: Number,
      default: 120,
    },
  });
</script>

<template>
  <v-card>
    <NuxtLink
      :to="advert?.link || '#'"
      target="_blank"
    >
      <Image
        :src="advert?.image"
        :alt="advert?.title"
        :height="`${heightImage}`"
        cover
      />
    </NuxtLink>
  </v-card>
</template>
