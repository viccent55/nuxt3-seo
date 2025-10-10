<script setup lang="ts">
  import usePWA from "@/composables/usePwaInstall";
  import { useStore } from "~/store";
  import { ref, onMounted, watch } from "vue";
  const store = useStore();
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

  const canShow = ref(false);
  onMounted(() => {
    canShow.value = true;
  });
</script>

<template>
  <div v-if="canShow">
    <!-- Install Prompt -->
    <v-dialog
      v-model="showInstallPrompt"
      transition="dialog-bottom-transition"
      width="500"
      persistent
    >
      <v-card>
        <v-card-title class="d-flex align-center flex-column ga-2 mt-2">
          <img
            width="100"
            src="/logo.png"
          />
        </v-card-title>

        <v-card-text v-if="isIOS">
          <div
            class="text-body-2 text-break"
            style="width: 100%"
            v-html="store.configuration?.wap_popup_ios"
          ></div>
        </v-card-text>
        <v-card-text v-else>
          <div
            class="text-body-2 text-break"
            style="width: 100%"
            v-html="store.configuration?.wap_popup"
          ></div>
        </v-card-text>
        <v-card-actions
          v-if="isIOS"
          class="justify-end"
        >
          <v-btn
            text
            @click="closeInstallPrompt"
          >
            关闭
          </v-btn>
        </v-card-actions>
        <v-card-actions
          v-else
          class="justify-end"
        >
          <v-btn
            text
            @click="closeInstallPrompt"
          >
            现在不要
          </v-btn>
          <v-btn
            color="primary"
            @click="onInstall"
          >
            安装
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
