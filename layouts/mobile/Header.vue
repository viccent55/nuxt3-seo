<script setup lang="ts">
  onMounted(() => {})
  const title = computed(() => {
    let url = useRoute().name
    if (url === 'index') {
      url = 'Home'
    }
    return url
  })
</script>
<template>
  <div>Heder path</div>
</template>
<style lang="scss" scoped></style>
