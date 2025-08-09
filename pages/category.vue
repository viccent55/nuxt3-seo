<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  useSeo({});
  const { store } = useHome();
</script>

<template>
  <v-container class="pt-0">
    <!-- Categories -->
    <DesktopHomeCategoryMenu />
    <NuxtPage />
    <v-row class="mt-2">
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in store.advertisement?.POSITION_HOME_BOTTOM"
        :key="index"
      >
        <DesktopAdvertSlot :advert="item" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>
