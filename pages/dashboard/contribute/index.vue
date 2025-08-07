<script lang="ts" setup>
  const tabs = ["已发布", "未审核", "未通过", "草稿"];
  const activeTab = ref(0);
</script>
<template>
  <v-card
    flat
    color="transparent"
  >
    <v-tabs
      v-model="activeTab"
      density="compact"
      color="primary"
      background-color="transparent"
      hide-slider
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab"
      >
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-divider class="my-2" />

    <v-card-text>
      <v-list class="bg-transparent">
        <v-list-item
          v-for="(item, i) in 4"
          :key="i"
        >
          <v-list-item-content>
            <v-list-item-title class="text-truncate">
              {{ activeTab }} || {{ i + 1 }}
              标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
            </v-list-item-title>
            <v-list-item-subtitle>2025-01-04</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
