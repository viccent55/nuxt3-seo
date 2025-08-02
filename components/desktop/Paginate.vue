<script lang="ts" setup>
  const props = defineProps<{
    page: number;
    total: number;
    limit: number;
    isMobile: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:page", value: number): void;
  }>();

  const inputPage = ref(1);

  watch(
    () => props.page,
    (v) => {
      inputPage.value = v;
    }
  );

  const maxPage = computed(() => Math.ceil(props.total / props.limit) || 1);

  const clampPage = (page: number) => {
    return Math.min(Math.max(1, page || 1), maxPage.value);
  };

  const goToPage = () => {
    emit("update:page", clampPage(inputPage.value));
  };
</script>

<template>
  <v-row
    dense
    justify="center"
  >
    <v-col class="d-flex align-center">
      <div
        v-if="!isMobile"
        class="text-subtitle-2 text-grey"
      >
        共 {{ total }} 条
      </div>
      <v-pagination
        v-model="inputPage"
        :length="maxPage"
        active-color="primary"
        :total-visible="isMobile ? 4 : 10"
        class="ma-1"
        :density="isMobile ? 'compact' : 'comfortable'"
        @update:model-value="goToPage"
      />
      <template v-if="!isMobile">
        <v-text-field
          v-model.number="inputPage"
          hide-details
          type="number"
          class="mx-2 pagination-input"
          label="到第"
          style="max-width: 80px"
          density="compact"
          variant="outlined"
          min="1"
          :max="maxPage"
          @keyup.enter="goToPage"
          @blur="inputPage = clampPage(inputPage)"
        />
        <v-btn
          @click="goToPage"
          color="primary"
          variant="outlined"
          density="comfortable"
        >
          确认
        </v-btn>
      </template>
    </v-col>
  </v-row>
</template>

<style scoped>
  .pagination-input :deep(.v-field) {
    height: 30px;
    min-height: 30px;
    width: 70px;
  }
  .pagination-input :deep(.v-field__input) {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 30px;
  }
</style>
