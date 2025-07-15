<script setup lang="ts">

  const state = reactive({
    keywords: "nuxt3, seo, vue, web development",
    title: "Nuxt3 SEO",
    description: "A Nuxt 3 project with SEO optimizations"
  });
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
        <v-row>
          <v-col cols="8">
            <div class="d-flex align-center ga-5">
              <v-btn
                variant="text"
                class="pa-0 text-body-1 font-weight-bold"
                to="/home"
                tag="h1"
              >
                LOGO
              </v-btn>
              
              <!-- Navigation -->
              <nav
                aria-label="Main navigation"
                class="d-flex ga-8"
              >
                <NuxtLink
                  to="/home"
                  class="text-button"
                >
                  首页
                </NuxtLink>
                <NuxtLink
                  to="/topics"
                  class="text-button"
                >
                  专题
                </NuxtLink>
                <NuxtLink
                  to="/characters"
                  class="text-button"
                >
                  人物
                </NuxtLink>
                <NuxtLink
                  to="/tags"
                  class="text-button"
                >
                  标签
                </NuxtLink>
              </nav>
            </div>
          </v-col>
          <v-col
            cols="4"
            class="d-flex justify-end"
          >
            <div
              class="d-flex align-center ga-6"
              style="width: 350px"
            >
              <v-text-field
                v-model="state.title"
                hide-details
                density="compact"
                variant="outlined"
                placeholder="请输入搜索内容"
                prepend-inner-icon="mdi-magnify"
                style="max-width: 240px"
                rounded="lg"
                class="bg-grey-lighten-4 rounded-lg"
              />
              <v-divider vertical></v-divider>
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

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
  .router-link-exact-active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
  }
</style>
