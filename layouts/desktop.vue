<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
</script>
<template>
  <Header />
  <v-main class="bg-background">
    <v-container
      fluid
      class="container"
    >
      <v-card
        color="transparent "
        flat
      >
        <slot />
      </v-card>
    </v-container>
  </v-main>
  <Footer />
</template>
