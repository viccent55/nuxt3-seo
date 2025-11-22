<script setup lang="ts">
  import Header from "./mobile/Header.vue";
  import Footer from "./desktop/Footer.vue";
  import Toolbar from "./mobile/Toolbar.vue";
  import Search from "./mobile/Search.vue";

  const searchRef = useTemplateRef("search-article");
</script>
<template>
  <v-main class="bg-background">
    <Header @search="searchRef?.open()" />
    <InstallPWA />
    <slot />
    <Footer
      v-if="['index', 'subject', 'actor', 'tag'].includes(String($route?.name))"
    />
  </v-main>
  <Search ref="search-article" />
  <Toolbar />
</template>
