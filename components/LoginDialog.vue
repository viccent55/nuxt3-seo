<script setup lang="ts">
  import { ref, reactive, watch } from "vue";
  import { useUserStore } from "@/store/user";
  import { useStore } from "@/store";
  import { login, register } from "@/composables/useAppApi";
  import { closeLoginDialog, loginDialogVisible } from "@/hooks/useLoginDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { generateCode } from "@/utils/toolsValidate";
  import useVariable from "@/composables/useVariable";
  import ForgotPassword from "./ForgotPassword.vue";

  const dialogMode = ref<"all" | "left" | "right">();
  const store = useStore();
  const storeUser = useUserStore();
  const snackbar = useSnackbar();

  const state = reactive({
    login: { email: "", password: "" },
    register: {
      email: "",
      password: "",
      password_repeat: "",
      invite_code: "",
      visitor: "",
      subscribed: 0,
    },
    isLogin: true,
  });

  const { onCopy } = useVariable();

  watch(
    () => screenMode.value,
    (value, oldValue) => {
      if (!oldValue) {
        dialogMode.value = screenMode.value === "pc" ? "all" : "right";
      }
      if (value === "pc") dialogMode.value = "all";
      else if (oldValue === "pc") dialogMode.value = "right";
    },
    { immediate: true }
  );

  const handleClose = () => {
    state.isLogin = true;
    closeLoginDialog();
  };

  const resetRegisterForm = () => {
    state.register.email = "";
    state.register.password = "";
    state.register.password_repeat = "";
    state.register.invite_code = "";
    state.register.subscribed = 0;
  };

  const onLogin = async () => {
    if (!state.login.email)
      return snackbar.showSnackbar("请输入您的电子邮件", "warning");
    if (!state.login.password)
      return snackbar.showSnackbar("请输入您的密码", "warning");

    try {
      const response: any = await login(state.login);
      if (response.errcode === 0) {
        storeUser.login(response.data?.token, response.data?.userinfo);
        snackbar.showSnackbar("登录成功", "success");
        closeLoginDialog();
      } else {
        snackbar.showSnackbar(response.info, "error");
      }
    } catch (e) {
      console.error("Error during login:", e);
    }
  };

  const onPrepareRegister = async () => {
    if (!state.register.email)
      return snackbar.showSnackbar("请输入您的电子邮件", "warning");
    if (!state.register.password || !state.register.password_repeat)
      return snackbar.showSnackbar("请输入您的密码", "warning");
    if (state.register.password !== state.register.password_repeat)
      return snackbar.showSnackbar("两次密码不一致", "warning");

    try {
      const request = {
        ...state.register,
        visitor: storeUser.isUseToRegister
          ? generateCode()
          : storeUser.visitCode,
        chan: store.chan ?? "",
      };
      const response: any = await register(request);
      if (response.errcode === 0) {
        snackbar.showSnackbar("已申请注册!", "success");
        resetRegisterForm();
        state.isLogin = true;
        storeUser.isUseToRegister = true;
      } else {
        snackbar.showSnackbar(response.info, "error");
      }
    } catch (e) {
      console.error("Error during register:", e);
    }
  };

  const onAuth = () => {
    state.isLogin ? onLogin() : onPrepareRegister();
  };

  const forgotPasswordRef = ref();
  const openFogotDialog = () => {
    loginDialogVisible.value = false;
    forgotPasswordRef.value.openDialog();
  };
</script>

<template>
  <v-dialog
    v-model="loginDialogVisible"
    max-width="500"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex justify-end">
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleClose"
        />
      </v-card-title>
      <v-card-text class="pt-0">
        <!-- Tabs -->
        <v-tabs
          v-model="state.isLogin"
          class="mb-4"
          grow
          color="primary"
        >
          <v-tab :value="true">登录</v-tab>
          <v-tab :value="false">注册</v-tab>
        </v-tabs>

        <v-tabs-window v-model="state.isLogin">
          <!-- Login -->
          <v-tabs-window-item :value="true">
            <v-form class="mt-5">
              <v-text-field
                v-model="state.login.email"
                label="邮箱或用户名"
                type="email"
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-model="state.login.password"
                label="密码"
                type="password"
                variant="outlined"
                density="comfortable"
                @keyup.enter="onAuth"
              />
              <v-btn
                block
                color="error"
                class="mt-4"
                size="large"
                rounded="pill"
                @click="onAuth"
              >
                登录
              </v-btn>
            </v-form>
          </v-tabs-window-item>

          <!-- Register -->
          <v-tabs-window-item :value="false">
            <v-form>
              <v-text-field
                v-model="state.register.email"
                label="邮箱或用户名 (最少6位)"
                type="email"
                variant="outlined"
              />
              <v-text-field
                v-model="state.register.password"
                label="密码"
                type="password"
                variant="outlined"
              />
              <v-text-field
                v-model="state.register.password_repeat"
                label="重复密码"
                type="password"
                variant="outlined"
              />
              <v-text-field
                v-model="state.register.invite_code"
                label="邀请码"
                variant="outlined"
              />
              <v-btn
                block
                color="error"
                class="mt-4"
                size="large"
                rounded="pill"
                @click="onPrepareRegister"
              >
                注册
              </v-btn>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>

        <!-- Extra actions -->
        <div class="mt-6">
          <v-btn
            v-if="state.isLogin"
            block
            color="secondary"
            variant="tonal"
            size="large"
            rounded="pill"
            @click="openFogotDialog"
          >
            忘记密码？
          </v-btn>

          <v-btn
            v-if="screenMode == 'phone'"
            block
            color="warning"
            variant="flat"
            rounded="xl"
            class="mt-2"
            @click="openPage(store.configuration?.download_app_url)"
          >
            App下载
          </v-btn>
        </div>

        <!-- Mobile extra links -->
        <div
          v-if="screenMode === 'phone'"
          class="mt-4"
        >
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>备用地址：</v-list-item-title>
              <v-list-item-subtitle>
                <a
                  :href="store.configuration?.home_url"
                  target="_blank"
                  class="text-primary"
                >
                  {{ store.configuration?.home_url }}
                </a>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>备用地址：</v-list-item-title>
              <v-list-item-subtitle>
                <a
                  :href="store.configuration?.domain_next"
                  target="_blank"
                  class="text-primary"
                >
                  {{ store.configuration?.domain_next }}
                </a>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>永久域名：</v-list-item-title>
              <v-list-item-subtitle>
                <a
                  :href="store.configuration?.domain_latest"
                  target="_blank"
                  class="text-primary"
                >
                  {{ store.configuration?.domain_latest }}
                </a>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>防失联邮箱：</v-list-item-title>
              <v-list-item-subtitle
                @click="
                  () => {
                    onCopy(store.configuration?.email);
                    snackbar.showSnackbar('复制成功', 'success');
                  }
                "
              >
                <span class="text-primary">
                  {{ store.configuration?.email }}
                </span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <ForgotPassword
    ref="forgotPasswordRef"
    @open="loginDialogVisible = true"
  />
</template>
