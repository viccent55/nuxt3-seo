<script setup lang="ts">
  import Header from "./mobile/Header.vue";
  import Footer from "./mobile/Footer.vue";
  import { type NavigationItem } from "@/types/item";
  import { NavigationItems } from "@/common";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  const { store, router, storeUser } = useVariable();
  const clickNavigationItem = (item: NavigationItem) => {
    if (item.type === "router-link") {
      if (item.href != "/user") {
        store.mode = item.mode;
        store.channel = "001";
        router.push(item.href);
      } else {
        checkPermissions(PERMISSION.User, () => {
          store.mode = item.mode;
          store.mode = item.href;
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
  <v-main class="bg-background">
    <slot />
  </v-main>
  <Footer
    :active-item="store.mode"
    :items="NavigationItems"
    @click-nav-item="clickNavigationItem"
  ></Footer>
</template>
