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
        router.push(item.href);
      } else {
        checkPermissions(PERMISSION.User, () => {
          store.mode = item.mode;
          router.push({ path: `/user/${storeUser.useId}` });
        });
      }
    } else {
      // openPage(item.href);
    }
  };
</script>
<template>
  <v-layout>
    <Header />
    <v-main class="page-main">
      <slot />
    </v-main>
    <Footer
      :active-item="store.mode"
      :items="NavigationItems"
      @click-nav-item="clickNavigationItem"
    ></Footer>
  </v-layout>
</template>
<style scoped lang="scss">
  .page-main {
    padding-top: 64px; /* match your header height */
    padding-bottom: 64px; /* if footer is fixed too */
  }
</style>
