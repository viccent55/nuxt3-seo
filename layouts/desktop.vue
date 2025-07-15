<script setup lang="ts">
  import Header from './desktop/Header.vue'
  import Footer from './desktop/Footer.vue'
</script>
<template>
  <Header />
  <v-main class="bg-grey-lighten-5">
    <slot />
  </v-main>
  <Footer />
</template>
