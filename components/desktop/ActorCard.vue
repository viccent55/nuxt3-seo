<script lang="ts" setup>
  defineProps({
    items: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
  });
  const hoveredIndex = ref(0);
</script>
<template>
  <v-card
    class="pa-4"
    flat
    v-if="items?.length"
  >
    <Image
      :src="items[hoveredIndex]?.cover"
      height="160"
      cover
      class="rounded mt-2"
    />
    <v-card-text>
      <div class="truncate-2 mb-2">
        {{ items[hoveredIndex]?.name }}
      </div>
      <v-divider class="my-2"></v-divider>
      <ul class="text-body-2 text-grey-darken-1 ps-2">
        <li
          v-for="(item, index) in items"
          class="cursor-pointer mb-2"
          :class="{ 'text-primary': hoveredIndex === index }"
          :key="index"
          @mouseover="hoveredIndex = index"
          @mouseleave="hoveredIndex = 0"
          @click="$router.push('/actor/article/' + item.id)"
        >
          {{ item?.name }}
        </li>
      </ul>
    </v-card-text>
  </v-card>
  <v-card
    v-else
    flat
    class="pa-4"
  >
    没有商品...
  </v-card>
</template>
