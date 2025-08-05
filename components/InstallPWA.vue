<script setup lang="ts">
  import { usePWA } from "~/composables/usePwa";

  const { showInstallPrompt, isIOS, promptInstall, closeInstallPrompt } =
    usePWA();

  const onInstall = async () => {
    await promptInstall();
    // The prompt will be hidden automatically after the user interacts with it.
    closeInstallPrompt();
  };
</script>

<template>
  <div
    v-if="showInstallPrompt"
    class="install-pwa-overlay"
    @click.self="closeInstallPrompt"
  >
    <div
      class="install-pwa-modal"
      role="alert"
    >
      <div class="banner-content">
        <img
          src="/logo.png"
          alt="App Logo"
          class="app-logo"
        />
        <div class="text-content">
          <p class="title">Install Xiaohongshu!</p>
          <p class="description">Add to home screen for a better experience.</p>
        </div>
      </div>

      <!-- iOS Instructions -->
      <div
        v-if="isIOS"
        class="ios-instructions"
      >
        <div class="flex flex-col">
          <p class="ios-text">
            1. 点击“分享”图标
            <v-icon>mdi-share</v-icon>
            在您的浏览器菜单中。
          </p>
          <p class="ios-text pl-4">
            Tap the 'Share' icon
            <el-icon
              :size="20"
              style="vertical-align: middle"
            >
              <v-icon>mdi-share</v-icon>
            </el-icon>
            in your browser menu.
          </p>
        </div>

        <div class="flex flex-col">
          <p class="ios-text">2. 向下滚动并点击“添加到主屏幕”。</p>
          <p class="ios-text pl-4">Scroll down and tap 'Add to Home Screen'.</p>
        </div>
        <div class="ios-close-button">
          <v-btn
            variant="text"
            size="default"
            @click="closeInstallPrompt"
          >
            I understand
          </v-btn>
        </div>
      </div>

      <!-- Android/Desktop Prompt -->
      <div
        v-else
        class="buttons"
      >
        <v-btn
          density="compact"
          @click="closeInstallPrompt"
        >
          Not now
        </v-btn>
        <v-btn
          color="primary"
          density="compact"
          @click="onInstall"
        >
          Install
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .install-pwa-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 2100;
  }

  .install-pwa-modal {
    background-color: rgb(var(--v-theme-surface));
    width: 100%;
    max-width: 500px;
    padding: 20px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    animation: slide-up 0.3s ease-out;
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 20px;
  }

  .app-logo {
    width: 60px;
    height: auto;
    border-radius: 8px;
  }

  .text-content {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    margin: 0;
  }

  .description {
    font-size: 14px;
    color: rgb(var(--v-theme-surface-variant));
    margin: 0;
  }

  .buttons,
  .ios-close-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex-shrink: 0;
    margin-top: 20px;
  }

  .ios-instructions {
    border-top: 1px solid var(--el-border-color-light);
    padding-top: 16px;
  }

  .ios-text {
    font-size: 15px;
    color: var(--el-text-color-primary);
    margin: 0;
    align-items: center;
    gap: 4px;
  }
</style>
