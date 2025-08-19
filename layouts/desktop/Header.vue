<script setup lang="ts">
  import { useStore } from "~/store";
  import { useAuthStore } from "~/store/auth";
  import { useGlobalDialog } from "~/store/globalDialog";

  const store = useStore();
  const auth = useAuthStore();
  const storeDialog = useGlobalDialog();
  const { isMobile } = useVariable();
  const state = reactive({
    drawer: false,
  });

  const searchState = reactive({
    input: "",
    items: [] as any[],
    loading: false,
  });

  let debounceTimer: NodeJS.Timeout;

  const fetchSearchResults = () => {
    $fetch("/api/home/search", {
      method: "POST",
      body: { keyword: searchState.input },
    })
      .then((res: any) => {
        searchState.items = res.data.items || [];
      })
      .finally(() => {
        searchState.loading = false;
      });
  };

  watch(
    () => searchState.input,
    (newValue) => {
      clearTimeout(debounceTimer);
      if (newValue && newValue.trim() !== "") {
        searchState.loading = true;
        debounceTimer = setTimeout(() => {
          fetchSearchResults();
        }, 500);
      } else {
        searchState.items = [];
        searchState.loading = false;
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

          <v-btn
            class="pa-0 text-body-1 font-weight-bold me-4"
            tag="h1"
            to="/"
            variant="tonal"
          >
            <v-img
              width="130"
              src="/logo.png"
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
            v-model:search="searchState.input"
            :items="searchState.items"
            :loading="searchState.loading"
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
                  searchState.input ? "没有找到结果" : "请输入关键词开始搜索"
                }}
              </div>
            </template>
          </v-autocomplete>
          <!-- Mobile Menu Icon -->
          <v-btn
            icon
            variant="text"
            class="d-flex d-md-none"
            @click="state.drawer = !state.drawer"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>

          <!-- Divider + Auth -->
          <div
            class="d-none d-md-flex align-center text-caption"
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

  <!-- Mobile Drawer Navigation -->
  <v-navigation-drawer
    v-model="state.drawer"
    temporary
    location="left"
    class="d-sm-none"
    width="200"
  >
    <v-list
      nav
      class="text-center"
    >
      <!-- Categories Section -->
      <div v-if="store.configuration?.categories?.length">
        <v-list-item
          v-for="(category, index) in store.configuration.categories"
          :key="index"
          :to="`/category/${category.id}`"
          :title="category.name"
        />
        <v-divider class="my-2" />
      </div>

      <!-- Loading state for categories -->
      <template v-else>
        <v-list-item
          v-for="n in 3"
          :key="`skeleton-${n}`"
          disabled
        >
          <v-skeleton-loader
            type="text"
            width="80px"
            height="20px"
          />
        </v-list-item>
        <v-divider class="my-2" />
      </template>

      <!-- Auth Section -->
      <template v-if="!store.userInfo?.username">
        <v-list-item
          title="登录"
          @click="openLogin"
        />
        <v-list-item
          title="注册"
          @click="openRegister"
        />
      </template>
      <template v-else>
        <v-list-item
          :title="store.userInfo?.nickname || store.userInfo?.username"
          :to="`/dashboard/${store.dbRouteName}`"
        />

        <v-list-item
          title="退出登录"
          @click="auth.clearToken()"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
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
