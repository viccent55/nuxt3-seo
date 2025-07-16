<script lang="ts" setup>
  import { useWindowSize } from "@vueuse/core";
  import { useTheme } from "vuetify";
  import { useStore } from "~/store";
  const { width } = useWindowSize();
  const isMobile = computed(() => width.value < 768);

  const theme = useTheme();
  const store = useStore();
  const toggleDark = () => {
    store.setTheme(store.darkMode === "dark" ? "light" : "dark");
    theme.change(store.darkMode);
  };

  const showButton = ref(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const checkScroll = () => {
    showButton.value = window.scrollY > 300;
  };

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", checkScroll);
  });
  onMounted(() => {
    theme.change(store.darkMode);
    window.addEventListener("scroll", checkScroll);
  });
</script>
<template>
  <v-app>
    <NuxtLayout :name="isMobile ? 'mobile' : 'desktop'">
      <NuxtLoadingIndicator />
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
    <!-- Floating FAB -->
    <v-fab
      class="fab"
      icon="mdi-brightness-6"
      size="small"
      @click="toggleDark"
    />
    <v-fab
      v-if="showButton"
      class="scroll-to-top"
      size="small"
      icon="mdi-arrow-up"
      @click="scrollToTop"
    />
  </v-app>
</template>
<style scoped>
  .fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 99;
  }
  .scroll-to-top {
    position: fixed;
    bottom: 80px;
    right: 30px;
    z-index: 99;
  }
</style>
