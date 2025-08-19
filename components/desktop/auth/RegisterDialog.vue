<script setup lang="ts">
  import { useGlobalDialog } from "~/store/globalDialog";

  const snackbar = useSnackbar();
  const storeDialog = useGlobalDialog();
  const state = reactive({
    form: {
      username: "",
      password: "",
      password_repeat: "",
    },
    visible: false,
    visibleRepeat: false,
    valid: false,
  });
  const formRef = ref();
  const usernameRules = [
    (v: string) => !!v || "请输入用户名",
    (v: string) => v.length >= 3 || "用户名不能少于 3 个字符",
  ];

  const passwordRules = [
    (v: string) => !!v || "请输入密码",
    (v: string) => v.length >= 6 || "密码不能少于 6 位",
  ];
  const repeatPasswordRules = [
    (v: string) => !!v || "请确认密码",
    (v: string) => v === state.form.password || "两次密码输入不一致",
  ];

  const onRegister = async () => {
    const isValid = await formRef.value?.validate();
    if (!isValid.valid) return;
    try {
      const response = await $fetch<any>("/api/auth/register", {
        method: "POST",
        body: state.form,
      });
      if (response.code == 0 || response.code == 200) {
        snackbar.showSnackbar("登录成功", "success", "top center");
      } else {
        snackbar.showSnackbar(response.msg, "error", "top center");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const closeDialog = () => {
    storeDialog.register.isShowDialog = false;
    state.form = {
      username: "",
      password: "",
      password_repeat: "",
    };
  };
  const onLogin = () => {
    closeDialog();
    storeDialog.login.isShowDialog = true;
  };
</script>

<template>
  <v-dialog
    v-model="storeDialog.register.isShowDialog"
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
        <div class="text-h5 text-medium-emphasis text-center mb-5">
          {{ storeDialog.register.title }}
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
            v-model="state.form.username"
            :rules="usernameRules"
            density="default"
            placeholder="用户名"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            required
          />
          <v-text-field
            class="my-2"
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
          />
          <v-text-field
            v-model="state.form.password_repeat"
            :rules="repeatPasswordRules"
            :append-inner-icon="state.visibleRepeat ? 'mdi-eye-off' : 'mdi-eye'"
            :type="state.visibleRepeat ? 'text' : 'password'"
            density="default"
            placeholder="确认密码"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            required
            @click:append-inner="state.visibleRepeat = !state.visibleRepeat"
          />
          <v-btn
            class="my-4"
            color="primary"
            size="large"
            variant="flat"
            block
            @click="onRegister"
          >
            登录
          </v-btn>
        </v-form>

        <div class="d-flex justify-center ga-5 mb-2">
          <div class="d-flex justify-center mb-2">
            <div>已有账户？</div>
            <div
              @click="onLogin()"
              class="text-blue cursor-pointer"
            >
              登录
            </div>
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
