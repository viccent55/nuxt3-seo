<script setup lang="ts">
  defineProps({
    skeleton: {
      type: Number,
      default: 4,
    },
    loader: {
      type: Number,
      default: 10,
    }
  });
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
</script>

<template>
  <div>
    <!-- A-Z Headers (non-clickable) -->
    <div class="d-flex align-center flex-wrap mb-6">
      <span class="text-caption mr-4">首字母检索</span>
      <v-chip
        v-for="letter in alphabet"
        :key="letter"
        class="text-caption px-2 mx-1"
        color="grey-lighten-3"
        variant="outlined"
        size="small"
        disabled
      >
        {{ letter }}
      </v-chip>
    </div>

    <!-- Simulated Tag Sections -->
    <div
      v-for="n in skeleton"
      :key="n"
      class="mb-8"
    >
      <!-- Fake Alphabet Heading -->
      <v-skeleton-loader
        type="text"
        width="24px"
        height="24px"
        class="mb-2"
      />

      <!-- Fake Tag Chips -->
      <div class="d-flex flex-wrap gap-2">
        <v-skeleton-loader
          v-for="i in loader"
          :key="i"
          width="100px"
          height="32px"
          class="rounded-pill mb-4"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gap-2 {
    gap: 8px;
  }
</style>
