<script lang="ts" setup>
  import { useDisplay, useTheme } from "vuetify";
  import type { VSnackbar } from "vuetify/components/VSnackbar";
  import { openLoginDialog } from "@/hooks/useLoginDialog";
  import NotificationDialog from "@/components/NotificationDialog.vue";
  import NoteDialog from "@/components/explore/NoteDialog.vue";
  import UpdateVersion from "@/components/UpdateVersion.vue";

  import {
    initPermissions,
    setDefaultPermission,
    setDefaultRejectCallback,
  } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { useLocalStorage } from "@vueuse/core";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { useNoteArticleDialog } from "@/hooks/useNoteArticleDialog";
  import { useNoteForbidden } from "@/hooks/useNoteForbiddenDialog";
  import { useNoteHookupDialog } from "@/hooks/useNoteHookupDialog";
  import { createId } from "@paralleldrive/cuid2";

  const { storeUser, store } = useVariable();
  const { initAds } = useHome();
  const theme = useTheme();
  const showButton = ref(false);
  const notificationDialogRef = ref<InstanceType<typeof NotificationDialog>>();
  const noteDialog = useNoteDialog();
  const noteArticleDetail = useNoteArticleDialog();
  const noteForbiddenDialog = useNoteForbidden();
  const noteHookupDialog = useNoteHookupDialog();
  const permissions = [PERMISSION.Visitor, PERMISSION.User];
  const { scrollableElement, scrollTop } = useScrollManager();
  const { mobile } = useDisplay();

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

  const chatWidgetRef = useTemplateRef("chatWidgetRef");
  const handle = {
    triggerSnackbar(
      msg: string,
      color: string = "success",
      location: SnackbarLocation = "bottom center",
      time: number = 3000
    ) {
      state.message = msg;
      state.color = color;
      state.timeout = time;
      state.show = true;
      state.location = location;
    },
    showChatWidget() {
      chatWidgetRef?.value?.open();
    },
  };

  // ✅ Provide as a single object
  provide("uiActions", handle);

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

  const { smAndDown } = useDisplay();
  const layoutName = computed(() => {
    return smAndDown.value ? "mobile" : "desktop";
  });
  const reloadPage = () => {
    window.location.reload();
  };

  // --- Server & Client Safe Initialization ---
  // Use a cookie to persist the visitor code across server and client.
  const visitCodeCookie = useCookie("visit-code", {
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  // If the cookie is not set, generate a new code. This runs on the server or client.
  if (!visitCodeCookie.value) {
    visitCodeCookie.value = createId();
  }
  // Sync the cookie value to the Pinia store so it's available everywhere.
  storeUser.visitCode = visitCodeCookie.value;

  // from our composable, which is updated by the active scrolling component.
  watch(scrollTop, (value) => {
    showButton.value = value > 200;
  });
  const scrollToTop = () => {
    scrollableElement.value?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const updateVersionRef = ref();
  onBeforeMount(async () => {
    await store.getConfiguration();

    if (store.localVersion != store.configuration?.version) {
      updateVersionRef.value?.openNoteDialog();
    }
  });
  onMounted(() => {
    theme.change(store.darkMode);

    setTimeout(() => {
      noteDialog.queryNoteDialogId();
      noteArticleDetail.queryNoteDialogId();
      noteForbiddenDialog.queryNoteDialogId();
      noteHookupDialog.queryNoteDialogId();
    }, 500);
    initAds();
    initializeApp();

    const { needRefresh } = usePwaInstall();
    const { isNative } = usePlatform();
    watch(needRefresh, (isNeeded) => {
      if (isNeeded && mobile.value && !isNative.value) {
        updateVersionRef.value?.openNoteDialog();
      }
    });
    
  });
</script>
<template>
  <v-snackbar
    v-model="state.show"
    :color="state.color"
    :timeout="state.timeout"
    :location="state.location"
    style="padding-top: var(--safe-area-inset-top, 0px)"
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
    <NuxtLayout :name="layoutName">
      <NuxtLoadingIndicator />
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
    <!-- Floating FAB -->
    <div>
      <v-fab
        class="fab"
        icon="mdi-refresh"
        size="small"
        @click="reloadPage()"
      />
      <v-fab
        class="scroll-to-top"
        size="small"
        icon="mdi-arrow-up"
        v-show="showButton"
        @click="scrollToTop"
      />
    </div>
    <LoginDialog></LoginDialog>
    <NotificationDialog
      ref="notificationDialogRef"
      @retry="reloadPage"
    />
    <UpdateVersion ref="updateVersionRef" />

    <NoteDialog />
    <ArticleNoteDialog />
    <ForbiddenNoteDialog />
    <HookupNoteDialog />

    <DesktopDialogPopupAds
      v-if="!storeUser.loginDialogVisible && store.homePopupAds?.length"
      :adverts="store.homePopupAds"
    />
    <!-- <InstallPWA v-if="!storeUser.loginDialogVisible" /> -->

    <AnalyticsLoader :analytics="store.configuration?.analytics" />
    <!-- chat widget -->
    <ChatWidgetLoader ref="chatWidgetRef" />
  </v-app>
</template>

<style scoped lang="scss">
  .fab,
  .scroll-to-top {
    position: fixed;
    right: 10px;
    z-index: 99;
  }

  .fab {
    bottom: 120px;
  }
  .scroll-to-top {
    bottom: 170px;
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
  .splash-container {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: var(--v-theme-background);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.6s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
