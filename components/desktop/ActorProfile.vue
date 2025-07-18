<script lang="ts" setup>
  const props = defineProps({
    item: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
    size: {
      type: String,
      default: "24px",
    },
    
  });
  onMounted(async () => {});
</script>
<template>
  <div
    class="d-flex align-center text-grey"
    :key="item.id"
  >
    <v-avatar
      :size="size"
      class="mr-1"
    >
      <Image
        :src="item.avatar"
        alt="Avatar"
      />
    </v-avatar>
    <div class="f11">{{ item.name }}</div>
  </div>
</template>
