<script setup lang="ts">
import Header from './desktop/Header.vue';
import Footer from './desktop/Footer.vue';

</script>
<template>
  <div class="desktop">
      <Header />
      <slot />
      <Footer/>
  </div>
</template>
