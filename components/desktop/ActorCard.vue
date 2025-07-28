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
  <v-sheet class="pa-4 rounded">
    <v-card
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
            :key="index"
            class="cursor-pointer mb-2"
            :class="{ 'text-primary': hoveredIndex === index }"
            @mouseover="hoveredIndex = index"
            @mouseleave="hoveredIndex = 0"
          >
            <NuxtLink
              :to="`/actor/detail/${item.id}`"
              class="text-decoration-none"
              @mouseover="hoveredIndex = index"
              @mouseleave="hoveredIndex = -1"
              :class="
                hoveredIndex === index ? 'text-primary' : 'text-grey-darken-1'
              "
            >
              {{ item?.name }}
            </NuxtLink>
          </li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card
      v-else
      flat
    >
      没有商品...
    </v-card>
  </v-sheet>
</template>
