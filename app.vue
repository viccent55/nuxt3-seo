<script lang="ts" setup>
  import { useTheme } from "vuetify";
  import type { VSnackbar } from "vuetify/components/VSnackbar";
  import { openLoginDialog } from "@/hooks/useLoginDialog";
  import NotificationDialog from "@/components/NotificationDialog.vue";
  import { screenMode } from "@/hooks/useScreenMode";
  import NoteDialog from "@/components/explore/NoteDialog.vue";
  import {
    checkPermissions,
    initPermissions,
    setDefaultPermission,
    setDefaultRejectCallback,
  } from "./hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { useLocalStorage } from "@vueuse/core";
  import { useNoteDialog } from "./hooks/useNoteDialog";
  import { useNoteArticleDialog } from "./hooks/useNoteArticleDialog";
  import { useNoteAnimeDialog } from "./hooks/useNoteAnimeDialog";

  const { storeUser, store } = useVariable();
  const { initAds } = useHome();
  const theme = useTheme();
  const showButton = ref(false);
  const notificationDialogRef = ref<InstanceType<typeof NotificationDialog>>();
  const { generateVisitCode, initVisitor } = useHome();
  const noteDialog = useNoteDialog();
  const noteArticleDetail = useNoteArticleDialog();
  const noteAnimeDetail = useNoteAnimeDialog();
  const permissions = [PERMISSION.Visitor, PERMISSION.User];

  initPermissions(permissions);

  setDefaultPermission(
    storeUser.isLogin ? PERMISSION.User : PERMISSION.Visitor
  );

  setDefaultRejectCallback(openLoginDialog);

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

  const initializeApp = () => {
    const LOGIN_DIALOG_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
    // SSR-safe localStorage refs
    const lastLoginPromptTimestamp = useLocalStorage<number | null>(
      "lastLoginPromptTimestamp",
      null
    );
    // --- login check ---
    if (!storeUser.isLogin) {
      const now = Date.now();
      if (
        !lastLoginPromptTimestamp.value ||
        now - lastLoginPromptTimestamp.value > LOGIN_DIALOG_COOLDOWN
      ) {
        openLoginDialog();
        lastLoginPromptTimestamp.value = now;
      }
    }
  };

  const handleFetchError = (error: any) => {
    console.error("Server is down or initial fetch failed:", error);

    if (process.client) {
      const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour
      const lastNotificationTimestamp = useLocalStorage<number | null>(
        "lastNotificationTimestamp",
        null
      );

      // --- notification cooldown ---
      const now = Date.now();
      if (
        !lastNotificationTimestamp.value ||
        now - lastNotificationTimestamp.value > NOTIFICATION_COOLDOWN
      ) {
        notificationDialogRef.value?.open();
        lastNotificationTimestamp.value = now;
      }
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  onBeforeMount(async () => {
    if (!storeUser.visitCode) {
      generateVisitCode();
    } else {
      initVisitor();
    }
  });

  try {
    await store.getConfiguration();
  } catch (error) {
    handleFetchError(error);
  }
  onMounted(() => {
    theme.change(store.darkMode);
    setTimeout(() => {
      noteDialog.queryNoteDialogId();
      noteArticleDetail.queryNoteDialogId();
      noteAnimeDetail.queryNoteDialogId();
    }, 500);
    initAds();
    initializeApp();
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
  <v-app class="bg-white">
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
      />
    </div>
    <LoginDialog></LoginDialog>
    <NotificationDialog
      ref="notificationDialogRef"
      @retry="reloadPage"
    />
    <NoteDialog />
    <ArticleNoteDialog />
    <AnimeNoteDialog />
    <DesktopDialogPopupAds
      v-if="!storeUser.loginDialogVisible && store.homePopupAds?.length"
      :adverts="store.homePopupAds"
    />
    <!-- <InstallPWA v-if="!storeUser.loginDialogVisible" /> -->

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
