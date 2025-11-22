<script lang="ts" setup>
  import { useAuthStore } from "~/store/auth";
  import { useGlobalDialog } from "~/store/globalDialog";

  const state = reactive({
    drawer: false,
  });
  const auth = useAuthStore();
  const { store } = useVariable();
  const storeDialog = useGlobalDialog();

  const openLogin = () => {
    storeDialog.onLogin();
  };
  const openRegister = () => {
    storeDialog.onRegister();
  };
  const onHomePage = () => {
    window.location.href = "/";
  };
</script>
<template>
  <!-- Mobile Drawer Navigation -->
  <v-app-bar
    flat
    color="surface"
    class="border-b"
  >
    <v-container class="container">
      <v-row
        dense
        justify="space-between"
        align="center"
        no-gutters
      >
        <!-- Left section (Logo + Navigation) -->
        <v-col>
          <!-- Logo -->
          <h1 class="d-none">{{ store.configuration?.website_slogan }}</h1>
          <v-img
            src="/logo.png"
            lazy-src="/logo.png"
            alt="Logo"
            @click="onHomePage()"
          />
        </v-col>
        <v-col cols="9">
          <div class="d-flex justify-end align-center w-100">
            <!-- Divider + Auth -->
            <div
              v-if="!store.userInfo?.username"
              class="d-flex align-center"
            >
              <v-btn
                size="small"
                @click="openLogin"
              >
                登录
              </v-btn>
              |
              <v-btn
                size="small"
                @click="openRegister"
              >
                注册
              </v-btn>
              <v-btn
                size="small"
                @click="$emit('search')"
                icon="mdi-magnify"
              ></v-btn>
            </div>
            <div
              class="align-center text-caption"
              v-else
            >
              <v-btn
                size="small"
                icon="mdi-logout"
                @click="auth.clearToken()"
              ></v-btn>
            </div>
            <!-- Mobile Menu Icon -->
            <v-btn
              icon
              variant="text"
              @click="state.drawer = !state.drawer"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
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
          :to="`/category_${category.id}`"
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
