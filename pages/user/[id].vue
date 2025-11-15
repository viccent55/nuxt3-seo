<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });

  import { retrySendEmailCode, veryCode } from "@/service/user";
  import UserInfo from "~/components/user/UserInfo.vue";
  import { getUserInfo, getConfigs } from "@/service/user";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { follow } from "@/service/explore";
  import { useDisplay } from "vuetify";

  const userInfo = ref<any>({});
  const code = ref("");
  const pending = ref(true);
  const { route, store, storeUser } = useVariable();
  const { smAndDown } = useDisplay();
  const id = computed(() => Number(route.params.id));
  const self = computed(() => storeUser.useId === id.value);
  const isShowPupup = ref(false);
  const loading = ref(false);
  const { showSnackbar, showChatWidget } = useSnackbar();
  const onVeryEmail = async () => {
    if (!userInfo.value.email) {
      showSnackbar("请输入您的代码", "warning");
      return;
    }
    try {
      loading.value = true;
      const response = await retrySendEmailCode({
        email: userInfo.value.email,
      });

      if (response.errcode === 0) {
        showSnackbar(response.info, "success", "top");
        isShowPupup.value = true;
      } else {
        showSnackbar(response.info, "error");
      }
      isShowPupup.value = true;
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      loading.value = false;
    }
  };

  const verifyEmail = async () => {
    if (!userInfo.value.email) {
      showSnackbar("请输入您的代码", "warning");
      return;
    }
    if (!code.value) {
      showSnackbar("需要代码！", "error");
      return;
    }
    try {
      const response = await veryCode({
        email: userInfo.value.email,
        code: code.value,
      });
      if (response.errcode === 0) {
        showSnackbar(response.info, "success");
      } else {
        showSnackbar(response.info, "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const menu = [
    {
      name: "联系客服",
      value: "call",
      icon: "mdi-phone-outline",
    },
    {
      name: "邀请记录",
      value: "invite",
      icon: "mdi-account-group-outline",
    },

    {
      name: "我的关注",
      value: "note",
      icon: "mdi-folder-account-outline",
    },
    {
      name: "收藏",
      value: "like",
      icon: "mdi-thumb-up-outline",
    },
    {
      name: "下列的",
      value: "follow",
      icon: "mdi-account-multiple-plus-outline",
    },
    {
      name: "点赞",
      value: "star",
      icon: "mdi-star-outline",
    },
    {
      name: "商务广告",
      value: "telegram",
      icon: "mdi-handshake-outline",
    },
  ];

  const displayMenu = computed(() => {
    if (self.value) {
      return menu;
    }
    return menu.filter((item) => !["like", "star"].includes(item.value));
  });

  const pageWrapperRef = ref<HTMLElement | null>(null);

  const pupupData = useTemplateRef("popup-data");
  const inviteRef = useTemplateRef("inviteRef");
  const onClickMenu = async (item: EmptyObjectType) => {
    if (item.value == "call") {
      return showChatWidget();
    } else if (item.value == "invite") {
      return inviteRef.value?.open();
    } else if (item.value == "telegram") {
      if (config.value?.tg_business) {
        navigateTo(config.value.tg_business, {
          external: true,
          open: { target: "_blank" },
        });
      } else {
        navigateTo("https://t.me/HFDHG9985", {
          external: true,
          open: { target: "_blank" },
        });
      }

      return;
    }
    pupupData.value?.open(item);
  };

  const onInit = async () => {
    pending.value = true;
    const res = await getUserInfo(id.value);
    userInfo.value = res.data;
  };
  const clickFollow = async (user: any) => {
    checkPermissions(PERMISSION.User, async () => {
      const res = await follow({
        id: id.value,
      });
      if (res.errcode === 0) user.isFollow = !user.isFollow;
    });
  };
  const config = ref<any>({});
  const getConfig = async () => {
    try {
      const params =
        "ai_clothes_background, ai_clothes_intro, ai_clothes_tg_link, ai_clothes_title, girl_join_background, girl_join_intro, girl_join_title, girl_join_tg_link, tg_business";
      const res = await getConfigs(params);
      config.value = res.data || {};
    } catch (e) {
      console.log(e);
    }
  };
  const dialogAiRef = useTemplateRef("dialog-ai");
  const onOpenAiDialog = (type: string) => {
    if (type == "left") {
      dialogAiRef.value?.open({
        title: config.value?.ai_clothes_title || "AI脱衣",
        content: config.value?.ai_clothes_intro || "",
        color: "success",
      });
    }
    if (type == "right") {
      dialogAiRef.value?.open({
        title: config.value?.girl_join_title || "楼凤入驻",
        content: config.value?.girl_join_intro || "",
        color: "",
      });
    }
  };
  const { isNative } = usePlatform();
  const heightOffset = computed(() => {
    if (!isNative.value) {
      if (smAndDown.value) {
        return "140px";
      } else {
        return "80px";
      }
    }
    return "120px";
  });
  onMounted(async () => {
    onInit();
    getConfig();
  });
</script>

<template>
  <v-container
    fluid
    class="px-0 py-0"
  >
    <div
      ref="pageWrapperRef"
      class="wrap-page"
    >
      <div
        class="user-background"
        :style="{
          backgroundImage: `url(${store?.configuration?.member_center_background})`,
        }"
      ></div>
      <div class="user-content-container">
        <div class="user-content mx-md-4">
          <UserInfo
            :user="userInfo"
            @click-follow="clickFollow"
            @refresh="onInit"
          />
          <v-alert
            v-if="self && userInfo.status == 0"
            type="warning"
            class="mt-4"
            border="start"
          >
            ⚠️ 未验证邮箱 {{ userInfo.email }} 验证后可订阅最新域名防止失联
            <v-btn
              small
              color="primary"
              :loading="loading"
              class="ml-2"
              @click="onVeryEmail"
            >
              验证邮箱
            </v-btn>
          </v-alert>
          <div class="w-100 px-4">
            <UserReferralnfo :userInfo="userInfo"></UserReferralnfo>
          </div>
          <!-- Browse History -->
          <UserBrowseHistory />

          <!-- Feature cards (AI remove / Business join) -->
          <v-row class="mt-2 px-3 px-md-0 w-100">
            <v-col cols="6">
              <v-card
                class="text-center pa-3"
                :height="smAndDown ? 140 : 200"
                rounded="xl"
                :color="config?.ai_clothes_background || '#965757'"
                @click="onOpenAiDialog('left')"
              >
                <div class="text-center text-subtitle-1 text-md-h6">
                  {{ config?.ai_clothes_title || "AI脱衣" }}
                </div>
                <v-avatar
                  :size="smAndDown ? 80 : 140"
                  color="white"
                >
                  <v-img src="/ai-girl.png"></v-img>
                </v-avatar>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card
                class="text-center pa-3"
                :height="smAndDown ? 140 : 200"
                rounded="xl"
                :color="config?.girl_join_background || '#965757'"
                @click="onOpenAiDialog('right')"
              >
                <div class="text-center text-subtitle-1 text-md-h6">
                  {{ config?.girl_join_title || "楼凤入驻" }}
                </div>
                <v-avatar
                  :size="smAndDown ? 80 : 140"
                  color="white"
                >
                  <v-img src="/ai-girl2.png"></v-img>
                </v-avatar>
              </v-card>
            </v-col>
          </v-row>
          <!-- Bottom Menu -->
          <div class="menu-grid pa-3 mt-2">
            <div
              v-for="(item, i) in displayMenu"
              :key="i"
              class="menu-item"
              @click="onClickMenu(item)"
            >
              <v-icon
                size="28"
                class="mb-2"
              >
                {{ item.icon }}
              </v-icon>
              <div class="text-caption text-md-h6">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <v-dialog
        v-model="isShowPupup"
        max-width="450"
      >
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text class="pb-0">
            <v-form>
              <v-text-field
                label="验证码"
                v-model="code"
                type="number"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="d-flex justify-end ga-3 ma-2">
              <v-btn
                variant="elevated"
                @click="isShowPupup = false"
              >
                取消
              </v-btn>
              <v-btn
                variant="elevated"
                @click="verifyEmail"
                color="primary"
              >
                确认
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <UserDialogAI
        ref="dialog-ai"
        @close="showChatWidget()"
      ></UserDialogAI>
      <UserPersonalNote ref="popup-data" />
      <UserDialogInvites
        ref="inviteRef"
        :user-info="userInfo"
      />
    </div>
  </v-container>
</template>

<style scoped lang="scss">
  .wrap-page {
    width: 100%; /* Default height for desktop */
    max-height: calc(100vh - v-bind(heightOffset));
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .user-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  .user-content-container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    margin: auto;
  }
  .user-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .channel-wrapper {
    width: fit-content;
  }
  .feeds-container {
    width: 100%;
    padding: 0 16px;
    flex-grow: 1;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 columns for mobile */
    gap: 20px;
    text-align: center;
    width: 100%;
  }

  @media (min-width: 960px) {
    .menu-grid {
      grid-template-columns: repeat(6, 1fr); /* 6 columns for desktop */
    }
  }

  .menu-item {
    cursor: pointer;
  }
</style>
