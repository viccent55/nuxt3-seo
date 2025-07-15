<template>
  <div class="d-flex align-center justify-space-between mb-3 mt-6">
    <div class="text-h6 text-blue-darken-2">{{ title }}</div>
    <v-btn text class="text-caption">MORE</v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
