<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>
<template>
  <v-app>
    <NuxtLayout :name="isMobile ? 'mobile' : 'desktop'">
      <NuxtLoadingIndicator />
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
