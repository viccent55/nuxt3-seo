<script setup lang="ts">
  import { NavigationItems } from "@/common";

  const state = reactive({
    keywords: "nuxt3, seo, vue, web development",
    title: "",
    description: "A Nuxt 3 project with SEO optimizations",
  });

  const filteredNavItems = computed(() =>
    NavigationItems.filter((item) =>
      ["/", "/article", "/anime", "/creator"].includes(item.href)
    )
  );
</script>
<template>
  <header>
    <v-app-bar
      flat
      color="white"
      class="border-b"
      height="64"
    >
      <!-- Left: Logo -->
      <v-container>
        <v-row dense>
          <v-col cols="4">
            <div class="d-flex align-center ga-5">
              <v-btn
                variant="text"
                class="pa-0 text-body-1 font-weight-bold"
                to="/"
              >
                <v-img
                  src="/logo.png"
                  width="80"
                  alt="Logo"
                ></v-img>
              </v-btn>

              <!-- Navigation -->
              <nav
                aria-label=" navigation"
                class="d-flex ga-8"
              >
                <NuxtLink
                  v-for="(item, index) in filteredNavItems"
                  :to="item.href"
                  class="text-button"
                  :key="index"
                >
                  {{ item.name }}
                </NuxtLink>
              </nav>
            </div>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="state.title"
              hide-details
              density="comfortable"
              variant="outlined"
              placeholder="请输入搜索内容"
              append-inner-icon="mdi-magnify"
              rounded="xl"
              class="bg-grey-lighten-4 rounded-xl"
            />
          </v-col>
          <v-col
            cols="4"
            class="d-flex justify-end"
          >
            <div class="d-flex align-center ga-6">
              <div class="d-flex align-center text-caption">
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
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </header>
</template>

<style lang="scss" scoped>
  .text-button {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    font-size: large !important;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
  .router-link-exact-active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
  }
</style>
