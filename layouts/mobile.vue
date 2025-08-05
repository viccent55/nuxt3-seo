<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
  import Toolbar from "./mobile/Toolbar.vue";
</script>
<template>
  <Header />
  <v-main class="bg-background">
    <InstallPWA />
    <ReloadPWA />
    <slot />
  </v-main>
  <Footer class="pb-14" />
  <Toolbar />
</template>
