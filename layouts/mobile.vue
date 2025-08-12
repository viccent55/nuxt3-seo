<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
  import Toolbar from "./mobile/Toolbar.vue";
</script>
<template>
  <Header />
  <v-main class="bg-background">
    <InstallPWA />
    <slot />
    <Footer
      v-if="['index', 'subject', 'actor', 'tag'].includes(String($route?.name))"
    />
  </v-main>
  <Toolbar />
</template>
