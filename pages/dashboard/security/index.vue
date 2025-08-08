<script lang="ts" setup>
  const form = ref();
  const snackbar = useSnackbar();
  const state = reactive({
    form: {
      old_password: "",
      password: "",
      password_repeat: "",
      socialLink: "",
      mobile: "",
      wechat: "",
    },
    loading: false,
    valid: true,
    rules: {
      old_password: [(v: string) => !!v || "请输入密码"],
      password: [
        (v: string) => !!v || "请输入密码",
        (v: string) => v.length >= 6 || "密码不能少于 6 位",
      ],
      password_repeat: [
        (v: string) => !!v || "请输入密码",
        (v: string) => v.length >= 6 || "密码不能少于 6 位",
        (v: string) => v === state.form.password || "两次密码不一致",
      ],
    },
    visible1: false,
    visible2: false,
    visible3: false,
  });
  const onSubmit = async () => {
    const response = await useApiFetch("/api/member/reset-password", {
      method: "POST",
      body: state.form,
    });
    snackbar.showSnackbar("提交成功", "success", "top center");
  };
</script>
<template>
  <v-card
    flat
    color="transparent"
  >
    <v-row dense>
      <v-col cols="12">
        <h6 class="text-h6 font-weight-bold">安全设置</h6>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-form
          class="mt-5"
          ref="form"
          lazy-validation
          v-model="state.valid"
        >
          <div
            class="text-h6 mb-4"
            style="width: 100px; text-align: end"
          >
            修改密码
          </div>
          <v-row dense>
            <v-col cols="12">
              <div class="mb-4 text-field">
                <label class="text-subtitle-1 mb-1 d-block">当前密码:</label>
                <v-text-field
                  v-model="state.form.old_password"
                  hide-details="auto"
                  hide-label
                  required
                  :append-inner-icon="
                    state.visible1 ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="state.visible1 ? 'text' : 'password'"
                  @click:append-inner="state.visible1 = !state.visible1"
                  variant="outlined"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-field">
                <label class="text-subtitle-1 mb-1 d-block">新密码:</label>
                <v-text-field
                  v-model="state.form.password"
                  :rules="state.rules.password"
                  density="compact"
                  variant="outlined"
                  :append-inner-icon="
                    state.visible2 ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="state.visible2 ? 'text' : 'password'"
                  @click:append-inner="state.visible2 = !state.visible2"
                  hide-details="auto"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div class="text-field">
                <label class="text-subtitle-1 d-block">确定密码:</label>
                <v-text-field
                  v-model="state.form.password_repeat"
                  :rules="state.rules.password_repeat"
                  :append-inner-icon="
                    state.visible3 ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="state.visible3 ? 'text' : 'password'"
                  @click:append-inner="state.visible3 = !state.visible3"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                />
              </div>
            </v-col>
            <v-col
              cols="12"
              align="center"
            >
              <v-btn
                @click="onSubmit()"
                density="comfortable"
                class="mt-3"
              >
                提交
              </v-btn>
            </v-col>
            <v-col cols="12">
              <!-- 社交账号绑定 -->
              <div
                class="text-h6 mb-4"
                style="width: 140px; text-align: end"
              >
                社交账号绑定
              </div>
            </v-col>
            <v-col cols="12">
              <!-- 推广链接 -->
              <div class="mb-4 text-field">
                <label class="text-subtitle-1">手机号:</label>
                <span
                  class="text-body-1 text-grey ml-2"
                  style="width: 130px"
                >
                  {{ state.form.socialLink }}
                </span>
                <v-btn
                  color="primary"
                  elevation="0"
                  density="comfortable"
                >
                  更换手机号
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="mb-4 text-field">
                <label class="text-subtitle-1">微信:</label>
                <span
                  class="text-body-1 text-grey ml-2"
                  style="width: 130px"
                >
                  {{ state.form.wechat }}
                </span>
                <v-btn
                  color="primary"
                  elevation="0"
                  density="comfortable"
                >
                  取消绑定
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped lang="scss">
  .text-field {
    display: flex;
    gap: 8px;
    align-items: center;
    label {
      text-align: end;
      width: 100px;
    }
  }
</style>
