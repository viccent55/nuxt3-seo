<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
</script>
<template>
  <v-container class="px-0 container">
    <Header />
    <v-main class="bg-background">
      <slot />
    </v-main>
    <Footer />
  </v-container>
</template>
