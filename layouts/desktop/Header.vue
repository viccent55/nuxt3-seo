<script setup lang="ts">
  import { useStore } from "~/store";
  import { useAuthStore } from "~/store/auth";
  import { useGlobalDialog } from "~/store/globalDialog";

  const store = useStore();
  const auth = useAuthStore();
  const storeDialog = useGlobalDialog();
  const state = reactive({
    search: "",
    items: [] as any[],
    loading: false,
  });

  let debounceTimer: NodeJS.Timeout;

  const fetchSearchResults = () => {
    $fetch("/api/home/search", {
      method: "POST",
      body: { keyword: state.search },
    })
      .then((res: any) => {
        state.items = res.data.items || [];
      })
      .finally(() => {
        state.loading = false;
      });
  };

  watch(
    () => state.search,
    (newValue) => {
      clearTimeout(debounceTimer);
      if (newValue && newValue.trim() !== "") {
        state.loading = true;
        debounceTimer = setTimeout(() => {
          fetchSearchResults();
        }, 500);
      } else {
        state.items = [];
        state.loading = false;
      }
    }
  );

  const openLogin = () => {
    storeDialog.onLogin();
  };
  const openRegister = () => {
    storeDialog.onRegister();
  };
</script>

<template>
  <v-app-bar
    flat
    color="surface"
    class="border-b"
  >
    <v-container class="container">
      <v-row
        align="center"
        no-gutters
      >
        <!-- Left section (Logo + Navigation) -->
        <v-col
          md="6"
          sm="8"
          cols="6"
          class="d-flex align-center"
        >
          <!-- Logo -->
          <h1 class="d-none">{{ store.configuration?.website_slogan }}</h1>
          <v-btn
            class="pa-0 text-body-1 font-weight-bold me-4"
            tag="h1"
            to="/"
            variant="tonal"
          >
            <v-img
              src="/logo.png"
              lazy-src="/logo.png"
              width="130"
              alt="Logo"
            />
          </v-btn>

          <!-- Desktop Navigation -->
          <nav class="d-none d-sm-flex ga-6">
            <NuxtLink
              v-for="(menu, index) in store.menus"
              :key="index"
              :to="menu.value"
              class="text-button"
            >
              {{ menu.name }}
            </NuxtLink>
          </nav>
        </v-col>

        <!-- Right section (Search + Login/Register) -->
        <v-col
          md="6"
          sm="4"
          cols="6"
          class="d-flex justify-end align-center ga-2 mt-sm-0"
        >
          <!-- Search Bar (only shown on sm+) -->
          <v-autocomplete
            v-model:search="state.search"
            :items="state.items"
            :loading="state.loading"
            item-title="title"
            item-value="id"
            hide-details
            density="compact"
            variant="outlined"
            placeholder="请输入搜索内容"
            prepend-inner-icon="mdi-magnify"
            class="d-none d-sm-flex search"
            style="max-width: 200px"
            rounded="lg"
            no-filter
            auto-select-first
            clearable
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                style="max-width: 300px"
                v-bind="props"
                :to="`/article/${item.raw.id}`"
              >
                <template #title>
                  <div class="text-body-2">{{ item.raw.title }}</div>
                </template>
              </v-list-item>
            </template>
            <template v-slot:no-data>
              <div class="pa-2 text-body-2">
                {{
                  state.search ? "没有找到结果" : "请输入关键词开始搜索"
                }}
              </div>
            </template>
          </v-autocomplete>
          <!-- Divider + Auth -->
          <div
            class="d-md-flex align-center text-caption"
            v-if="!store.userInfo?.username"
          >
            <v-btn
              @click="openLogin"
              class="me-2 text-button"
            >
              登录
            </v-btn>
            |
            <v-btn
              @click="openRegister"
              class="ms-2 text-button"
            >
              注册
            </v-btn>
          </div>
          <div
            class="d-none d-sm-flex align-center text-caption"
            v-else
          >
            <NuxtLink
              class="text-body-2 cursor-pointer text-decoration-none text-surface-variant"
              :to="`/dashboard/${store.dbRouteName}`"
            >
              {{ store.userInfo?.nickname || store.userInfo?.username }}
              &nbsp;
              <v-icon>mdi-cog</v-icon>
            </NuxtLink>
            <v-btn
              class="text-button px-0 mx-2"
              style="min-width: 35px"
              @click="auth.clearToken()"
            >
              &nbsp;
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped lang="scss">
  .text-button {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    font-weight: 500;
    &:hover {
      color: rgb(var(--v-theme-on-surface));
      font-weight: 500;
    }
  }
  .router-link-exact-active {
    color: rgb(var(--v-theme-on-surface));
    font-weight: 700;
    &:hover {
      font-weight: 700;
    }
  }
  :deep(.search .v-input__control) {
    width: 220px;
    max-width: 300px;
  }
</style>
