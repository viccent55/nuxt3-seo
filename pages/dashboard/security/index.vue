<script lang="ts" setup>
  const form = ref();
  const snackbar = useSnackbar();
  const state = reactive({
    form: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      socialLink: "",
      mobile: "",
      wechat: "",
    },
    loading: false,
    valid: false,
  });
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
          lazy
        >
          <div
            class="text-h6 mb-4"
            style="width: 100px; text-align: end"
          >
            修改密码
          </div>
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">当前密码:</label>
            <v-text-field
              v-model="state.form.currentPassword"
              hide-details
              hide-label
              variant="outlined"
              density="compact"
            />
          </div>
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">新密码:</label>
            <v-text-field
              v-model="state.form.newPassword"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
            />
          </div>

          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">确定密码:</label>
            <v-text-field
              v-model="state.form.confirmPassword"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
            />
          </div>

          <!-- 社交账号绑定 -->
          <div
            class="text-h6 mb-4"
            style="width: 140px; text-align: end"
          >
            社交账号绑定
          </div>
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
