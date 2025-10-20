<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: false,
    },
    more: {
      type: Boolean,
      default: true,
    },
    goto: {
      type: String,
      required: false,
    },
  });
</script>

<template>
  <div class="mt-2">
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
        v-if="more"
        variant="text"
        class="text-caption"
        :to="goto"
      >
        查看更多
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <div class="rounded-md">
      <slot />
    </div>
  </div>
</template>
