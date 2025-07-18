<script lang="ts" setup>
  const props = defineProps({
    item: {
      type: Object as PropType<EmptyObjectType>,
      default: () => ({}),
    },
  });
  onMounted(async () => {});
</script>
<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        tag="article"
        v-bind="props"
        :elevation="isHovering ? 8 : 0"
        class="transition-fast-in-fast-out"
      >
        <Image
          height="160px"
          :src="item.cover"
        ></Image>
        <v-card-text class="text-subtitle-2 pt-2 pb-0">
          {{ item.name }}
        </v-card-text>

        <v-card-text class="text-body-2 text-grey-darken-1 py-1">
          <div class="truncate-2 mb-2">
            {{ item.intro }}
          </div>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>
