<script setup lang="ts">
import { useStore } from '~/store';

  const store = useStore()
  const state = reactive({
    search: "",
    drawer: false,
  });

  const config = useRuntimeConfig();
  const baseUrl = new URL(config.public.apiBase).origin ?? "/public/logo.png";
</script>

<template>
  <header>
    <v-app-bar
      flat
      color="surface"
      height="64"
      class="border-b"
    >
      <v-container>
        <v-row
          align="center"
          no-gutters
        >
          <!-- Left section (Logo + Navigation) -->
          <v-col
            cols="6"
            sm="6"
            class="d-flex align-center"
          >
            <!-- Logo -->

            <v-btn
              class="pa-0 text-body-1 font-weight-bold me-4"
              tag="h1"
              to="/"
            >
              <v-img
                width="130"
                :src="baseUrl + store.configuration?.website_logo"
              />
            </v-btn>

            <!-- Desktop Navigation -->
            <nav class="d-none d-sm-flex ga-6">
              <NuxtLink
                to="/"
                class="text-button"
              >
                首页
              </NuxtLink>
              <NuxtLink
                to="/subject"
                class="text-button"
              >
                专题
              </NuxtLink>
              <NuxtLink
                to="/actor"
                class="text-button"
              >
                人物
              </NuxtLink>
              <NuxtLink
                to="/tag"
                class="text-button"
              >
                标签
              </NuxtLink>
            </nav>
          </v-col>

          <!-- Right section (Search + Login/Register) -->
          <v-col
            cols="6"
            md="6"
            class="d-flex justify-end align-center ga-4 mt-sm-0"
          >
            <!-- Mobile Menu Icon -->
            <v-btn
              icon
              variant="text"
              class="d-flex d-sm-none"
              @click="state.drawer = !state.drawer"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>

            <!-- Search Bar (only shown on sm+) -->
            <v-text-field
              v-model="state.search"
              hide-details
              density="compact"
              variant="outlined"
              placeholder="请输入搜索内容"
              prepend-inner-icon="mdi-magnify"
              class="d-none d-sm-flex search"
              style="max-width: 220px"
              rounded="lg"
            />

            <!-- Divider + Auth -->
            <div class="d-none d-sm-flex align-center text-caption">
              <NuxtLink
                to="/login"
                class="me-2 text-button"
              >
                登录
              </NuxtLink>
              |
              <NuxtLink
                to="/register"
                class="ms-2 text-button"
              >
                注册
              </NuxtLink>
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
    >
      <v-list nav>
        <v-list-item
          to="/"
          title="首页"
        />
        <v-list-item
          to="/subject"
          title="专题"
        />
        <v-list-item
          to="/actor"
          title="人物"
        />
        <v-list-item
          to="/tag"
          title="标签"
        />
        <v-divider class="my-2" />
        <v-list-item
          to="/login"
          title="登录"
        />
        <v-list-item
          to="/register"
          title="注册"
        />
      </v-list>
    </v-navigation-drawer>
  </header>
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
