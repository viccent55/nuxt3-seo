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
        if (item.href == "/anime" ) {
          if(storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin)
          return (isVisible.value = true);
        } else {
          store.mode = item.mode;
          router.push(item.href);
        }
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
  const isVisible = ref(false);
 
</script>
<template>
  <Header />
  <v-main class="bg-background main-content-wrapper">
    <slot />
  <AnimeRuleDialog v-model:model-value="isVisible"/>
  </v-main>
  <Footer
    :active-item="store.mode"
    :items="NavigationItems"
    @click-nav-item="clickNavigationItem"
  ></Footer>
</template>
<style scoped lang="scss">
  .main-content-wrapper {
    /* Ensure the content starts below the dynamic header */
    padding-top: calc(64px + var(--safe-area-inset-top, 0px));
    /* Ensure content ends above the dynamic footer */
    padding-bottom: calc(90px + var(--safe-area-inset-bottom, 0px));
    /* Use a min-height calculation if the content should always fill the screen */
  }
</style>
