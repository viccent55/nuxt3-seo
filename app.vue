<script lang="ts" setup>
  import { useTheme } from "vuetify";
  import { useStore } from "~/store";
  import type { VSnackbar } from "vuetify/components/VSnackbar";

  const { isMobile } = useVariable();

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

  type SnackbarLocation = VSnackbar["$props"]["location"];

  const state = reactive({
    message: "",
    color: "primary",
    timeout: 3000,
    show: false,
    location: "bottom center" as SnackbarLocation,
  });
  const triggerSnackbar = (
    msg: string,
    color: string = "success",
    location: SnackbarLocation = "bottom center",
    time: number = 3000
  ) => {
    state.message = msg;
    state.color = color;
    state.timeout = time;
    state.show = true;
    state.location = location;
  };
  provide("showSnackbar", triggerSnackbar);

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", checkScroll);
  });
  await store.fetchMenuCategories();
  onMounted(() => {
    theme.change(store.darkMode);
    window.addEventListener("scroll", checkScroll);
  });
</script>
<template>
  <v-snackbar
    v-model="state.show"
    :color="state.color"
    :timeout="state.timeout"
    :location="state.location"
  >
    {{ state.message }}
    <template v-slot:actions>
      <v-btn
        color="white"
        density="compact"
        variant="elevated"
        elevation="0"
        @click="state.show = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
  <v-app>
    <NuxtLayout :name="isMobile ? 'mobile' : 'desktop'">
      <AnalyticsLoader :analytics="store.configuration?.analytics" />
      <NuxtLoadingIndicator />
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
    <!-- Floating FAB -->
    <div>
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
    </div>
    <DesktopAuthLoginDialog />
    <DesktopAuthRegisterDialog />
    <DesktopDialogPopupAds
      :adverts="store.advertisement?.POSITION_HOME_POPUP"
    />
  </v-app>
</template>
<style scoped>
  .fab,
  .scroll-to-top {
    position: fixed;
    right: 10px;
    z-index: 99;
  }

  .fab {
    bottom: 80px;
  }
  .scroll-to-top {
    bottom: 130px;
  }

  /* Desktop overrides */
  @media (min-width: 960px) {
    .fab {
      bottom: 30px;
      right: 30px;
    }
    .scroll-to-top {
      bottom: 80px;
      right: 30px;
    }
  }
</style>
