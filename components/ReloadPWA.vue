<script setup lang="ts">
  import { usePWA } from "~/composables/usePwa";

  const { needRefresh, updateServiceWorker, closeReloadPrompt } = usePWA();

  const refresh = async () => {
    await updateServiceWorker();
  };
</script>

<template>
  <div
    v-if="needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      A new version is available, click reload to update.
    </div>
    <div class="buttons">
      <v-btn
        color="primary"
        density="compact"
        @click="refresh"
      >
        Reload
      </v-btn>
      <v-btn
        density="compact"
        @click="closeReloadPrompt"
      >
        Close
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  .pwa-toast {
    position: fixed;
    right: 16px;
    bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 12px 16px;
    border: 1px solid rgb(var(--v-theme-surface));
    border-radius: 8px;
    background-color: rgb(var(--v-theme-surface));
    box-shadow: var(--el-box-shadow-light);
    z-index: 2050; /* Higher than element-plus dialog */
  }

  .message {
    color: rgb(var(--v-theme-surface-variant));
    font-size: 14px;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }
</style>
