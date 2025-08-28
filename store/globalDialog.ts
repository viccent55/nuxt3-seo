import { useStore } from "~/store";
// stores/auth.ts
export const useGlobalDialog = defineStore("globalDialog", () => {
  const stateDialog = reactive({
    login: {
      isShowDialog: false,
      title: "登录",
      loginText: "登录",
    },
    register: {
      isShowDialog: false,
      title: "注册",
      registerText: "注册",
    },
  });

  const onLogin = () => {
    stateDialog.login.isShowDialog = true;
  };
  const onRegister = () => {
    stateDialog.register.isShowDialog = true;
  };

  return {
    ...stateDialog,
    onLogin,
    onRegister,
  };
});
