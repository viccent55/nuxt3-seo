<script lang="ts" setup>
  const props = defineProps({
    data: {
      type: Array as PropType<EmptyArrayType>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
</script>
<template>
  <v-row
    v-if="data && data.length"
    justify="center"
    align="center"
    class="w-100"
  >
    <v-col
      v-for="list in data"
      :key="list.id"
      cols="6"
      sm="5"
      md="4"
      lg="2"
      class="d-flex justify-center"
    >
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            v-bind="props"
            :to="`/novel/detail/${list.id}`"
            :color="isHovering ? 'primary' : undefined"
            flat
            rounded="lg"
            class="w-100 d-flex justify-center"
          >
            <div class="py-8 text-h6 text-surface-variant">
              {{ list.name }}
            </div>
          </v-card>
        </template>
      </v-hover>
    </v-col>
  </v-row>

  <v-row
    v-if="loading"
    justify="center"
    align="center"
    class="w-100"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </v-col>
  </v-row>
</template>
