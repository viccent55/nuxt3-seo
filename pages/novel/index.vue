<script setup lang="ts">
  const { store } = useVariable();
  const { configuration } = storeToRefs(store);

  useSeo(
    computed(() => configuration.value?.novel_title),
    computed(() => configuration.value?.novel_description),
    computed(() => configuration.value?.novel_keywords)
  );
</script>

<template>
  <div class="d-flex fill-height align-center justify-center">
    <div>
      <h1>Novel comming!...</h1>
      <h1>小說即將上線!...</h1>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
