<script lang="ts" setup>
  defineProps({
    item: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
  });
  const { dateStringTo24Hour } = useApp();
</script>

<template>
  <div class="mb-3">
    <div class="text-subtitle-2 truncate-2">{{ item.title }}</div>
    <div class="text-grey text-caption">
      {{ dateStringTo24Hour(item.created, "YYYY-DD-MM hh:mm") }}
    </div>
  </div>
</template>
<script setup lang="ts"></script>
