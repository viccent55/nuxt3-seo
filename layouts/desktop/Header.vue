<script setup lang="ts">
  import { NavigationItems } from "@/common";
  import { useTheme } from "vuetify/lib/composables/theme.mjs";
  import { useStore } from "~/store";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import useVariable from "@/composables/useVariable";

  const store = useStore();
  const theme = useTheme();
  const { router, storeUser } = useVariable();

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

  const clickNavigationItem = (item: any) => {
    // if (item.href === "/forbidden") {
    //   if (storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin) {
    //     router.push(item.href);

    //     return;
    //   }
    // }
    if (item.href === "/user") {
      checkPermissions(PERMISSION.User, () => {
        router.push({ path: `/user/${storeUser.useId}` });
      });
      return;
    }
    router.push(item.href);
  };
</script>
<template>
  <v-app-bar
    flat
    color="surface"
    class="border-b"
  >
    <div class="topbar">
      <!-- Left -->
      <div class="topbar__left">
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
          />
        </v-btn>
      </div>

      <!-- Center -->
      <div class="topbar__center">
        <nav
          aria-label="navigation"
          class="topbar__nav"
        >
          <a
            v-for="(item, index) in NavigationItems"
            :key="index"
            :href="item.href"
            @click.prevent="clickNavigationItem(item)"
            :class="[
              'text-button',
              { 'router-link-exact-active': $route.path === item.href },
            ]"
          >
            {{ item.name }}
          </a>
        </nav>

        <v-text-field
          v-model="store.search"
          hide-details
          density="compact"
          variant="outlined"
          placeholder="请输入搜索内容"
          append-inner-icon="mdi-magnify"
          rounded="xl"
          color="warning"
          class="topbar__search"
          @focus="onFocusSearch"
          @keydown.enter="onFocusSearch"
        />
      </div>

      <!-- Right -->
      <div class="topbar__right">
        <v-fab
          elevation="1"
          icon="mdi-brightness-6"
          color="surface"
          @click="toggleDark"
        />

        <v-btn
          v-for="(item, index) in menuItems"
          :key="index"
          @click="openLoginDialog(item)"
        >
          {{ item.name }}
        </v-btn>
      </div>
    </div>
  </v-app-bar>

  <DialogInfo ref="dialgInfo" />
</template>
<style lang="scss" scoped>
  .topbar {
    max-width: 1720px;
    margin: 0 auto;
    width: 100%;
    padding: 0 16px;

    display: flex;
    align-items: center;
    gap: 16px;
  }

  .topbar__left {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .topbar__center {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-width: 0; // important for truncation/shrinking
  }

  .topbar__nav {
    display: flex;
    align-items: center;
    gap: 28px;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
  }

  .topbar__search {
    flex: 0 0 500px;
    max-width: 500px;
  }

  .topbar__right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  @media (max-width: 1240px) {
    .topbar__nav {
      gap: 12px;
    }
    .topbar__search {
      flex-basis: 400px;
      max-width: 400px;
    }
  }
  /* Responsive: shrink gaps + allow search to shrink */
  @media (max-width: 1100px) {
    .topbar__nav {
      gap: 12px;
    }
    .topbar__search {
      flex-basis: 280px;
      max-width: 280px;
    }
  }

  /* Optional: on small screens hide nav and keep search */
  @media (max-width: 600px) {
    .topbar__nav {
      display: none;
    }
    .topbar__search {
      flex: 1 1 auto;
      max-width: none;
    }
  }

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
