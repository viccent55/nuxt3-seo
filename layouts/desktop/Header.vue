<script setup lang="ts">
  import { NavigationItems } from "@/common";
  import { useTheme } from "vuetify/lib/composables/theme.mjs";
  import { useStore } from "~/store";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";

  const store = useStore();
  const theme = useTheme();

  const toggleDark = () => {
    store.setTheme(store.darkMode === "dark" ? "light" : "dark");
    theme.change(store.darkMode);
  };
  const menuItems = computed(() => {
    const links = store.configuration?.header_menu_link || ""; // fallback empty string
    return links
      .split("\n")
      .filter((line: string) => line.includes("|")) // avoid bad lines
      .map((line: string) => {
        const [name, page] = line.split("|");
        return { name: name.trim(), page: page.trim() };
      });
  });
  const dialgInfo = ref();
  const openLoginDialog = (item: Record<string, string>) => {
    dialgInfo.value.open(item);
  };
  const searchDisabled = ref(false);
  const onFocusSearch = () => {
    if (searchDisabled.value) return;
    checkPermissions(PERMISSION.User, () => {});
  };
</script>
<template>
  <v-app-bar
    flat
    color="surface"
    class="border-b"
    height="64"
  >
    <!-- Left: Logo -->
    <v-container
      fluid
      max-width="1720px"
    >
      <v-row dense>
        <v-col cols="12">
          <div class="d-flex align-center ga-5 w-100 justify-space-between">
            <v-btn
              variant="text"
              class="pa-0 text-body-1 font-weight-bold"
              rounded="xl"
              href="/"
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
              class="d-flex ga-lg-8 ga-sm-3"
            >
              <NuxtLink
                v-for="(item, index) in NavigationItems"
                :to="item.href"
                class="text-button"
                :key="index"
                v-show="item.href != '/user'"
              >
                {{ item.name }}
              </NuxtLink>
            </nav>
            <v-text-field
              v-model="store.search"
              hide-details
              density="compact"
              variant="outlined"
              placeholder="请输入搜索内容"
              append-inner-icon="mdi-magnify"
              rounded="xl"
              color="surface-variant"
              class="rounded-xl"
              max-width="400px"
              @focus="onFocusSearch"
              @keydown.enter="onFocusSearch"
            />
            <div class="d-flex align-center ga-2">
              <v-fab
                elevation="1"
                icon="mdi-brightness-6"
                color="surface"
                @click="toggleDark"
              />
              <div class="d-flex align-center text-caption">
                <div class="d-flex">
                  <v-btn
                    v-for="(item, index) in menuItems"
                    :key="index"
                    @click="openLoginDialog(item)"
                  >
                    {{ item.name }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
  <DialogInfo ref="dialgInfo" />
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
