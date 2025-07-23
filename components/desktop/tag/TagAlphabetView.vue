<script setup lang="ts">
  const props = defineProps<{
    data: Record<string, { id: number; name: string; count: number }[]>;
  }>();

  const alphabet = computed(() => Object.keys(props.data).sort());
  const selectedTagId = ref<number | null>(null);
</script>

<template>
  <div>
    <h2 class="text-h6 mb-4">热门标签</h2>
    <!-- Alphabet Filter -->
    <div class="d-flex align-center flex-wrap mb-6">
      <span class="mr-4">首字母检索</span>
      <v-chip
        v-for="letter in alphabet"
        :key="letter"
        variant="text"
        class="text-grey-darken-1 text-button"
        size="x-small"
      >
        {{ letter }}
      </v-chip>
    </div>
    <!-- Tag List by Letter -->
    <div
      v-for="(tags, letter) in data"
      :key="letter"
      class="mb-8"
    >
      <h3 class="text-subtitle-1 mb-8">{{ letter }}</h3>
      <v-row>
        <v-col cols="12">
          <v-row class="flex-wrap ga-1">
            <v-divider class="mb-2"></v-divider>
            <v-chip
              v-for="tag in tags"
              :key="tag.id"
              :color="selectedTagId === tag.id ? 'primary' : undefined"
              variant="text"
              class="rounded-pill border"
              :to="'/tag/detail/' + tag.id"
            >
              {{ tag.name }}
            </v-chip>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
  .ga-2 {
    gap: 8px;
  }
</style>
