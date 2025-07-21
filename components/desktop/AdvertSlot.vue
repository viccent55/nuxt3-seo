<script setup lang="ts">
  defineProps({
    advert: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <v-card>
    <NuxtLink
      :to="advert.link || '#'"
      target="_blank"
    >
      <Image
        :src="advert.image"
        :alt="advert.title"
        height="120"
        cover
      />
    </NuxtLink>
  </v-card>
</template>
