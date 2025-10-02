<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
</script>
<template>
  <Header />
  <v-main>
    <slot />
  </v-main>
  <Footer />
</template>
