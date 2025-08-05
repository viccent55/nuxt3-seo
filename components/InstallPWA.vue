<script setup lang="ts">
  import usePWA from "~/composables/usePwaInstall";
import { useStore } from "~/store";
  const store = useStore()
  const {
    showInstallPrompt,
    isIOS,
    promptInstall,
    closeInstallPrompt,
    needRefresh,
    updateServiceWorker,
    closeReloadPrompt,
  } = usePWA();

  const onInstall = async () => {
    await promptInstall();
    closeInstallPrompt();
  };

  const refresh = async () => {
    await updateServiceWorker();
  };

  watch(needRefresh, (val) => {
    if (val) {
      setTimeout(() => closeReloadPrompt(), 15000);
    }
  });
</script>

<template>
  <div>
    <!-- Install Prompt -->
    <v-dialog
      v-model="showInstallPrompt"
      transition="dialog-bottom-transition"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title class="d-flex align-center flex-column ga-2">
          <img
            width="120"
            src="/public/logo.png"
          />
          <div>
            <div class="text-body-1">Install {{ store.configuration?.website_name }}</div>
            <div class="text-caption">
              Add to home screen for a better experience.
            </div>
          </div>
        </v-card-title>

        <v-card-text v-if="isIOS">
          <v-list-item>
            <v-list-item-title>
              1. Tap the 'Share' icon
              <v-icon>mdi-share</v-icon>
              in your browser menu.
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              2. Scroll down and tap 'Add to Home Screen'.
            </v-list-item-title>
          </v-list-item>
        </v-card-text>

        <v-card-actions
          v-else
          class="justify-end"
        >
          <v-btn
            text
            @click="closeInstallPrompt"
          >
            Not now
          </v-btn>
          <v-btn
            color="primary"
            @click="onInstall"
          >
            Install
          </v-btn>
        </v-card-actions>

        <v-card-actions
          v-if="isIOS"
          class="justify-end"
        >
          <v-btn
            text
            @click="closeInstallPrompt"
          >
            I understand
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reload Prompt -->
    <v-snackbar
      v-model="needRefresh"
      location="bottom center"
      color="white"
      timeout="-1"
    >
      <span>A new version is available.</span>
      <template #actions>
        <v-btn
          color="primary"
          @click="refresh"
          variant="elevated"
          density="compact"
        >
          Reload
        </v-btn>
        <v-btn
          class="ml-2"
          elevation="1"
          density="compact"
          @click="closeReloadPrompt"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
