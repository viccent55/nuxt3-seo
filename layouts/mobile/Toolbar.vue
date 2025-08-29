<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { useStore } from "~/store";
  import { useGlobalDialog } from "~/store/globalDialog";

  const route = useRoute();
  const store = useStore();
  const storeDialog = useGlobalDialog();

  const isActive = (path: string) => route.path.startsWith(path);
  const onToDashboard = () => {
    const token = useCookie("access_token");
    if (token.value) {
      navigateTo("/mobile-setting");
    } else {
      storeDialog.onLogin();
    }
  };
</script>

<template>
  <v-bottom-navigation
    grow
    class="d-md-none"
    height="56"
    color="surface"
    elevation="3"
    position="fixed"
    border="t"
  >
    <template v-for="menu in store.menusMobile" :key="menu.value">
      <v-btn
        :to="menu.value !== '/dashboard' ? menu.value : undefined"
        variant="text"
        :color="isActive(menu.value) ? 'primary' : 'grey'"
        @click="menu.value === '/dashboard' ? onToDashboard : undefined"
      >
        <v-icon>{{ menu.icon }}</v-icon>
        <span class="text-caption">{{ menu.name }}</span>
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>
