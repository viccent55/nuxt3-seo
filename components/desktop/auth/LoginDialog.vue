<script setup lang="ts">
  import { useStore } from "~/store";
  import { useAuthStore } from "~/store/auth";
  import { useGlobalDialog } from "~/store/globalDialog";

  const auth = useAuthStore();
  const store = useStore();
  const storeDialog = useGlobalDialog();
  const state = reactive({
    form: {
      username: "",
      password: "",
    },
    visible: false,
    valid: false,
  });
  const snackbar = useSnackbar();
  const formRef = ref();
  const usernameRules = [
    (v: string) => !!v || "请输入用户名",
    (v: string) => v.length >= 3 || "用户名不能少于 3 个字符",
  ];

  const passwordRules = [
    (v: string) => !!v || "请输入密码",
    (v: string) => v.length >= 6 || "密码不能少于 6 位",
  ];
  const login = async () => {
    const isValid = await formRef.value?.validate();
    if (!isValid.valid) return;
    try {
      const response = await $fetch<any>("/api/auth/login", {
        method: "POST",
        body: state.form,
      });
      if (response.errcode === 0) {
        auth.setToken(response.data.token);
        store.setUserInfo(response.data.userinfo);
        snackbar.showSnackbar(response?.info, "success", "top center");
        closeDialog();
      } else if (response.code === 429) {
        return snackbar.showSnackbar(response.info, "error", "top center");
      } else {
        return snackbar.showSnackbar(response?.info, "error", "top center");
      }
      // navigateTo("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  watch(
    () => storeDialog.login.isShowDialog,
    (v) => {
      if (!v) {
        closeDialog();
      }
    }
  );
  const closeDialog = () => {
    storeDialog.login.isShowDialog = false;
    state.form = {
      username: "",
      password: "",
    };
  };
  const onRegister = () => {
    closeDialog();
    storeDialog.register.isShowDialog = true;
  };
</script>

<template>
  <v-dialog
    v-model="storeDialog.login.isShowDialog"
    transition="scale-transition"
    persistent
  >
    <v-card
      class="mx-auto py-0"
      elevation="0"
      rounded="lg"
    >
      <v-card-title class="bg-blue-grey-lighten-5">
        <div class="d-flex justify-end">
          <v-btn
            icon
            variant="text"
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="text-h5 text-medium-emphasis text-center mb-5 text-primary">
          {{ storeDialog.login.title }}
        </div>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          v-model="state.valid"
          class="px-8 py-8"
          validate-on="blur"
        >
          <v-text-field
            class="mb-2"
            v-model="state.form.username"
            :rules="usernameRules"
            density="default"
            placeholder="用户名"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="state.form.password"
            :rules="passwordRules"
            :append-inner-icon="state.visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="state.visible ? 'text' : 'password'"
            density="default"
            placeholder="密码"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            required
            @click:append-inner="state.visible = !state.visible"
            @keydown.enter="login"
          />
          <v-btn
            class="my-4"
            color="primary"
            size="large"
            variant="flat"
            block
            @click="login"
          >
            {{ storeDialog.login.loginText }}
          </v-btn>
        </v-form>
        <div class="d-flex justify-center mb-2">
          <div>没有账号？</div>
          <div
            @click="onRegister()"
            class="text-blue cursor-pointer"
          >
            请注册
          </div>
        </div>
        <div class="d-flex justify-center text-subtitle-1">
          <p>登录即代表您已同意</p>
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            《服务协议和隐私政策》
          </a>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped>
  .text-primary {
    color: rgba(var(--v-theme-primary)) !important;
  }
</style>
