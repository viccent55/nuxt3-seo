<script setup lang="ts">
  defineProps<{ title: string }>();
</script>

<template>
  <div class="mt-6">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="d-flex align-center ga-3">
        <v-divider
          class="border-opacity-100"
          color="blue-darken-2"
          :thickness="5"
          vertical
        ></v-divider>
        <div class="text-subtitle-1 -blue-darken-2 d-flex align-center">
          {{ title }}
        </div>
      </div>
      <v-btn
        variant="text"
        class="text-caption"
      >
        MORE
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <div class="rounded-md">
      <slot />
    </div>
  </div>
</template>
