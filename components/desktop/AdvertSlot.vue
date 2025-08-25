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
