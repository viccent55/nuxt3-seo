<script setup lang="ts">
  defineProps<{
    isFollow: boolean;
  }>();

  defineEmits(["click"]);
</script>

<template>
  <v-btn
    :color="isFollow ? '' : 'primary'"
    @click="$emit('click')"
    class="bg-primary text-white"
  >
    {{ isFollow ? "已关注" : "关注" }}
  </v-btn>
</template>

<style scoped lang="scss">
  button {
    margin-left: auto;
    font-size: 16px;
    font-weight: 600;
    width: 76px;
    border-radius: 100px;
  }
</style>
