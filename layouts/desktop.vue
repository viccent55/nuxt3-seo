<script setup lang="ts">
  import Header from "./desktop/Header.vue";
  import Footer from "./desktop/Footer.vue";
  import type { NavigationItem } from "@/types/item";
  import { PERMISSION } from "@/common/permision";
  import { NavigationItems } from "@/common";
  import {
    checkPermissions,
    initPermissions,
    setDefaultPermission,
    setDefaultRejectCallback,
  } from "@/hooks/usePermisions";
  import { useUserStore } from "~/store/user";
  // 点击导航项
  import { openLoginDialog } from "@/hooks/useLoginDialog";

  const { store, router, storeUser } = useVariable();
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
  <Header />
  <v-main>
    <DesktopAside
      :items="NavigationItems"
      @click-nav-item="clickNavigationItem"
    />
    <slot />
    
  </v-main>
  <Footer />
</template>
