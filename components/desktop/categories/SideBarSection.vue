<script setup lang="ts">
  defineProps<{ title: string }>();
</script>

<template>
  <div class="mt-6">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-subtitle-1 text-blue-darken-2">{{ title }}</div>
      <v-btn
        text
        class="text-caption"
      >
        MORE
      </v-btn>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
