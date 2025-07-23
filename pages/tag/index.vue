<script lang="ts" setup>
  import TagAlphabetView from "~/components/desktop/tag/TagAlphabetView.vue";
  import TagSkeletonLoader from "~/components/desktop/tag/TagSkeletonLoader.vue";

  const { tagData, pending } = useTag();
</script>
<template>
  <v-container>
    <div v-if="!pending && tagData">
      <TagAlphabetView :data="tagData" />
    </div>
    <div
      v-else
      class="py-6"
    >
      <h2 class="text-h6 mb-4">热门标签</h2>
      <TagSkeletonLoader />
    </div>
  </v-container>
</template>

<style scoped>
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
