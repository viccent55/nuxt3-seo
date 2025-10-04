<script lang="ts" setup>
  import { useTheme } from "vuetify";
  import type { VSnackbar } from "vuetify/components/VSnackbar";
  import { openLoginDialog } from "@/hooks/useLoginDialog";
  import NotificationDialog from "@/components/NotificationDialog.vue";
  import { screenMode } from "@/hooks/useScreenMode";
  const { storeUser, store } = useVariable();
  const { initAds } = useHome();
  const theme = useTheme();
  const allAdsClosed = ref(false);
  const showButton = ref(false);
  const notificationDialogRef = ref<InstanceType<typeof NotificationDialog>>();

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

  // const initializeApp = async () => {
  //   const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour
  //   try {
  //     localStorage.removeItem("lastNotificationTimestamp");
  //     const LOGIN_DIALOG_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
  //     // If initMode is successful, check for login
  //     if (!storeUser.isLogin) {
  //       const lastLoginPrompt = localStorage.getItem(
  //         "lastLoginPromptTimestamp"
  //       );
  //       const now = Date.now();
  //       if (
  //         !lastLoginPrompt ||
  //         now - Number(lastLoginPrompt) > LOGIN_DIALOG_COOLDOWN
  //       ) {
  //         openLoginDialog();
  //         localStorage.setItem("lastLoginPromptTimestamp", String(now));
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Server is down or initial fetch failed:", error);
  //     const now = Date.now();
  //     const lastShown = localStorage.getItem("lastNotificationTimestamp");
  //     if (!lastShown || now - Number(lastShown) > NOTIFICATION_COOLDOWN) {
  //       notificationDialogRef.value?.open();
  //       localStorage.setItem("lastNotificationTimestamp", String(now));
  //     }
  //     allAdsClosed.value = false;
  //   }
  // };
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", checkScroll);
  });
  await store.getConfiguration();
  onMounted(() => {
    theme.change(store.darkMode);
    window.addEventListener("scroll", checkScroll);
    initAds();
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
    <NuxtLayout :name="screenMode == 'phone' ? 'mobile' : 'desktop'">
      <NuxtLoadingIndicator />
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
    <!-- Floating FAB -->
    <div>
      <v-fab
        v-if="showButton"
        class="scroll-to-top"
        size="small"
        icon="mdi-arrow-up"
        @click="scrollToTop"
      />
    </div>
    <LoginDialog></LoginDialog>
    <DesktopDialogPopupAds
      v-if="!storeUser.loginDialogVisible"
      :adverts="store.homePopupAds"
      @all-ads-closed="allAdsClosed = true"
    />
    <InstallPWA
      v-if="allAdsClosed"
      v-show="!storeUser.loginDialogVisible"
    />

    <AnalyticsLoader :analytics="store.configuration?.analytics" />
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
    bottom: 70px;
  }
  .scroll-to-top {
    bottom: 120px;
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
