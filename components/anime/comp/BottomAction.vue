<script setup lang="ts">
  import { ref, watchEffect } from "vue";

  const props = defineProps<{
    action: Record<string, any>;
    total: number;
  }>();

  const emits = defineEmits(["click-like", "click-star", "click-share"]);

  const replayTo = ref<{ id: string; name?: string }>({
    id: "",
    name: "",
  });

  watchEffect(() => {
    const item = props.action;
    if (item) {
      replayTo.value.id = item.id;
      replayTo.value.name = item.author?.name || "";
    }
  });
  const inputRef = ref<HTMLInputElement | null>(null);
  const inputFocus = (id: string, to: string | null) => {
    replayTo.value = { id };
    if (to) replayTo.value.name = to;
    inputRef.value?.focus();
  };

  defineExpose({ inputFocus });
</script>

<template>
  <v-card
    elevation="0"
    class="bottom-action pa-0"
  >
    <div class="d-flex justify-end align-center ga-2">
      <div class="d-flex align-center">
        <v-btn
          variant="text"
          density="comfortable"
          @click="$emit('click-like', action)"
          class="px-0"
        >
          <v-icon :color="action?.isLike ? 'primary' : ''">
            mdi-thumb-up-outline
          </v-icon>
          <span class="ml-1">{{ action?.like_count }}</span>
        </v-btn>
        <v-btn
          variant="text"
          density="comfortable"
          @click="$emit('click-star', action)"
          class="px-0"
        >
          <v-icon :color="action?.isStar ? 'primary' : ''">
            mdi-star-outline
          </v-icon>
          <span class="ml-1">{{ action?.star_count }}</span>
        </v-btn>

        <v-btn
          variant="text"
          density="comfortable"
          @click="$emit('click-share')"
          class="px-0"
          icon="mdi-share-outline"
        ></v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
  .bottom-action {
    height: 50px;
    display: flex;
    align-items: center;
  }

  .actions-container .v-btn {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .v-btn span {
    font-size: 14px;
  }
</style>
