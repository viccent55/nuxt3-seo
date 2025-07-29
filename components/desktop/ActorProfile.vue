<script lang="ts" setup>
  defineProps({
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
  <v-card
    color="transparent"
    flat
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
    <div
      class="f10"
      style="min-width: 30px; max-width: 50"
    >
      {{ item.name }}
    </div>
  </v-card>
</template>
