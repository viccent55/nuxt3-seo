<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { useStore } from "~/store";

  const route = useRoute();
  const store = useStore();

  const isActive = (path: string) => route.path.startsWith(path);
  const loginDialogRef = ref();
  const onToDashboard = () => {
    const token = useCookie("access_token");
    if (token.value) {
      navigateTo("/dashboard");
    } else {
      loginDialogRef.value.openDialog();
    }
  };
</script>

<template>
  <v-sheet color="transparent">
    <v-bottom-navigation
      grow
      class="d-md-none"
      height="56"
      color="surface"
      elevation="3"
    >
      <template
        v-for="(menu, index) in store.menusMobile"
        :key="index"
      >
        <v-btn
          v-if="menu.value === '/dashboard'"
          @click="onToDashboard"
          variant="text"
          :color="isActive(menu.value) ? 'primary' : ''"
          :class="isActive(menu.value) ? 'primary' : 'text-grey'"
        >
          <v-icon>{{ menu.icon }}</v-icon>
          <span class="text-caption">{{ menu.name }}</span>
        </v-btn>
        <v-btn
          v-else
          :to="menu.value"
          variant="text"
          :color="isActive(menu.value) ? 'primary' : ''"
          :class="isActive(menu.value) ? 'primary' : 'text-grey'"
        >
          <v-icon>{{ menu.icon }}</v-icon>
          <span class="text-caption">{{ menu.name }}</span>
        </v-btn>
      </template>
    </v-bottom-navigation>
    <desktop-auth-login-dialog ref="loginDialogRef" />
  </v-sheet>
</template>

<style scoped>
  .v-bottom-navigation {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    border-top: 1px solid rgba(var(--v-border-color), 0.12);
    background-color: rgb(var(--v-theme-surface));
  }
</style>
