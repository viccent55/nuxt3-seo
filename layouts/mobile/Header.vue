<script setup lang="ts">
  import { useTheme } from "vuetify/lib/composables/theme.mjs";
  import { useStore } from "~/store";
  import { openPage } from "@/utils/toolsValidate";
  import { adsClick } from "@/composables/useAppApi";

  const state = reactive({
    keywords: "nuxt3, seo, vue, web development",
    title: "",
    description: "A Nuxt 3 project with SEO optimizations",
  });
  const store = useStore();
  const theme = useTheme();
  const { onInstall, dialogIosGuide, openDialogIos } = usePwaInstall();
  const { route, getDeviceInfo } = useVariable();

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
  const onOpenPage = () => {
    const param = route.query.chan || "";
    const urlParams = new URLSearchParams(window.location.search);
    const chan = urlParams.get("chan"); // "cgtt"
    openPage(`${store.configuration?.download_app_url}?chan=${chan || param}`);
  };
  const dialogVisible = ref(false);
  const openAds = () => {
    dialogVisible.value = true;
  };
  const categories = computed(() => {
    return [
      {
        name: "发现",
        value: "001",
      },
      ...store.configuration?.categories?.map((item: EmptyObjectType) => ({
        name: item.name,
        value: item.id,
      })),
    ];
  });
  const clickMenuItem = (item: Record<string, string>) => {
    store.channel = item.value;
  };
</script>
<template>
  <header>
    <v-app-bar
      flat
      color="surface"
      class="border-b"
      height="64"
    >
      <!-- Left: Logo -->
      <v-container
        fluid
        max-width="1920px"
      >
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex align-center ga-5 w-100 justify-space-between">
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
              <v-text-field
                v-model="state.title"
                hide-details
                density="comfortable"
                variant="outlined"
                placeholder="请输入搜索内容"
                append-inner-icon="mdi-magnify"
                rounded="xl"
                color="surface-variant"
                class="rounded-xl"
                max-width="400px"
              />
              <div class="d-flex align-center ga-2">
                <v-fab
                  elevation="1"
                  icon="mdi-brightness-6"
                  color="surface"
                  density="comfortable"
                  @click="toggleDark"
                />
                <v-menu
                  activator="parent"
                  location="bottom"
                  transition="fade-transition"
                  min-width="auto"
                >
                  <!-- Activator Button -->
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      icon
                      class="more-btn"
                      density="comfortable"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <!-- Dropdown Content -->
                  <v-list
                    class="custom-dropdown"
                    density="comfortable"
                  >
                    <!-- Categories -->
                    <v-list-item
                      v-for="(item, index) in categories"
                      :key="index"
                      @click="clickMenuItem(item)"
                    >
                      <v-list-item-title class="px-3 py-1 text-base">
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-divider class="my-1" />

                    <!-- Install to Desktop (iOS/Android/Desktop) -->
                    <v-list-item>
                      <v-list-item-title>
                        <div
                          v-if="getDeviceInfo().isIos"
                          class="text-base px-3 py-1 cursor-pointer"
                          @click="openDialogIos"
                        >
                          安装到桌面
                          <v-icon
                            slot="prepend"
                            class="ms-2"
                          >
                            mdi-download
                          </v-icon>
                        </div>

                        <div
                          v-else
                          class="px-3 py-1 cursor-pointer"
                          @click="onInstall"
                        >
                          安装到桌面
                          <v-icon
                            slot="prepend"
                            class="ms-2"
                          >
                            mdi-download
                          </v-icon>
                        </div>
                      </v-list-item-title>
                    </v-list-item>

                    <!-- Download App -->
                    <v-list-item @click="onOpenPage">
                      <v-list-item-title class="text-base px-3 py-1">
                        下载app
                      </v-list-item-title>
                    </v-list-item>

                    <v-divider
                      thickness="3"
                      class="my-1"
                    />

                    <!-- Menu items + Ads -->
                    <v-list-item
                      v-for="(item, index) in [
                        ...menuItems,
                        { name: '福利应用', page: 'ads' },
                      ]"
                      :key="index"
                      @click="
                        item.page === 'ads' ? openAds() : openLoginDialog(item)
                      "
                    >
                      <v-list-item-title class="text-base px-3 py-1">
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <DialogInfo ref="dialgInfo" />
    <GlobalGuideIos ref="dialogIosGuide" />
    <v-dialog
      v-model="dialogVisible"
      max-width="320"
    >
      <v-card>
        <!-- Header -->
        <v-card-title class="justify-center text-center">
          推荐福利应用
        </v-card-title>

        <!-- Content -->
        <v-card-text>
          <AppLink
            class="mt-2"
            :apps="store?.recommendAds"
            v-if="store?.recommendAds?.length > 0"
            @item-click="(v: EmptyObjectType) => adsClick(v)"
            height="100%"
          />
        </v-card-text>

        <!-- Optional Close Actions -->
        <!--
      <v-card-actions class="justify-end">
        <v-btn text @click="handleClose">关闭</v-btn>
      </v-card-actions>
      --></v-card>
    </v-dialog>
  </header>
</template>

<style lang="scss" scoped>
  .custom-dropdown {
    width: 160px;
  }
</style>
