<script setup lang="ts">
  defineProps<{
    loading: boolean;
  }>();
</script>

<template>
  <div class="d-flex justify-center py-2">
    <v-progress-circular
      v-if="loading"
      :width="3"
      color="red"
      indeterminate
    ></v-progress-circular>
  </div>
</template>
