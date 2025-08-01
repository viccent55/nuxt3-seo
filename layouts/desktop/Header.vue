<script setup lang="ts">
  import { useStore } from "~/store";
  import { useAuthStore } from "~/store/auth";

  const store = useStore();
  const auth = useAuthStore();
  const { isMobile } = useVariable();
  const state = reactive({
    search: "",
    drawer: false,
  });

  const loginDialogRef = ref();
  const openLogin = () => {
    loginDialogRef.value.openDialog();
  };
  const registerDialogRef = ref();
  const openRegister = () => {
    registerDialogRef.value.openDialog();
  };
</script>

<template>
  <header>
    <v-app-bar
      flat
      color="surface"
      :height="isMobile ? 55 : 65"
      class="border-b"
    >
      <v-container width="1200">
        <v-row
          align="center"
          no-gutters
        >
          <!-- Left section (Logo + Navigation) -->
          <v-col
            cols="6"
            md="6"
            sm="12"
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
                src="/public/logo.png"
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
            sm="12"
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
            <div
              class="d-none d-sm-flex align-center text-caption"
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
              <v-btn
                to="/dashboard"
                class="text-button"
              >
                {{ store.userInfo?.nickname || store.userInfo?.username }}
                &nbsp;
                <v-icon>mdi-cog</v-icon>
              </v-btn>
              <v-btn
                class="text-button px-0 mx-0"
                min-width="35"
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
        <template v-if="store.configuration?.categories?.length">
          <v-list-item
            v-for="(category, index) in store.configuration.categories"
            :key="`category-${index}`"
            :to="`/${category.name}`"
            :title="category.name"
          />
          <v-divider class="my-2" />
        </template>

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
            to="/dashboard"
          />
          <v-list-item
            title="退出登录"
            @click="auth.clearToken()"
          />
        </template>
      </v-list>
    </v-navigation-drawer>
    <DesktopAuthLoginDialog ref="loginDialogRef" />
    <DesktopAuthRegisterDialog ref="registerDialogRef" />
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
