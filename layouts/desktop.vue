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
    <v-container
      fluid
      max-width="1720px"
      class="pa-0"
    >
      <v-row dense>
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
          <div class="content-column">
            <slot />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<style scoped>
  .aside-column {
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
  }
  .content-column {
    overflow-y: auto;
    height: calc(100vh - 80px);
    scrollbar-width: none;
  }
</style>
