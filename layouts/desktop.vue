<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import type { NavigationItem } from "@/types/item";
  import { PERMISSION } from "@/common/permision";
  import { NavigationItems } from "@/common";
  import {
    checkPermissions,
    initPermissions,
    setDefaultPermission,
    setDefaultRejectCallback,
  } from "@/hooks/usePermisions";
  // 点击导航项
  import { openLoginDialog } from "@/hooks/useLoginDialog";

  const { store, router, storeUser, isMobile } = useVariable();
  const permissions = [PERMISSION.Visitor, PERMISSION.User];
  initPermissions(permissions);

  setDefaultPermission(
    storeUser.isLogin ? PERMISSION.User : PERMISSION.Visitor
  );
  // 设置默认拒绝回调
  setDefaultRejectCallback(openLoginDialog);
  const clickNavigationItem = (item: NavigationItem) => {
    if (item.type === "router-link") {
      if (item.href != "/user") {
        // store.mode = item.mode;
        store.channel = "001";
        router.push(item.href);
      } else {
        checkPermissions(PERMISSION.User, () => {
          // store.mode = item.mode;
          // store.mode = item.href;
          router.push({ path: `/user/${storeUser.useId}` });
        });
      }
    } else {
      // openPage(item.href);
    }
  };
</script>
<template>
  <div>
    <!-- Header must be OUTSIDE v-main -->
    <Header />

    <!-- v-main needs padding-top so it doesn't jump after measuring app-bar -->
    <v-main class="pt-16">
      <v-container
        fluid
        max-width="1720px"
        class="pa-0"
      >
        <v-row no-gutters>
          <v-col
            class="d-none d-md-block aside-column"
            md="3"
            lg="2"
            cols="12"
          >
            <DesktopAside
              :items="NavigationItems"
              @click-nav-item="clickNavigationItem"
            />
          </v-col>
          <v-col
            md="9"
            lg="10"
            cols="12"
          >
            <div class="content-column position-relative">
              <slot />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
<style scoped>
  .aside-column {
    position: sticky;
    top: 80px;
    height: calc(100vh - 100px);
    overflow: auto;
    /* Firefox */
    scrollbar-width: thin; /* makes it thinner */
    scrollbar-color: #aaa transparent; /* optional colors */
  }

  /* Chrome, Edge, Safari (WebKit browsers) */
  .aside-column::-webkit-scrollbar {
    width: 2px; /* 👈 adjust scrollbar thickness here */
  }

  .aside-column::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.4); /* scrollbar handle color */
    border-radius: 4px;
  }

  .aside-column::-webkit-scrollbar-thumb:hover {
    background-color: rgba(100, 100, 100, 0.6);
  }

  .aside-column::-webkit-scrollbar-track {
    background: transparent; /* or a light gray if you prefer */
  }
</style>
