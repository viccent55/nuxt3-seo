<script setup lang="ts">
  import Header from "./mobile/Header.vue";
  import Footer from "./mobile/Footer.vue";
</script>
<template>
  <Header />
  <v-main>
    <slot />
  </v-main>
  <Footer />
</template>
