<script lang="ts" setup>
  const defaultAvatar =
    "https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png";

  const form = ref();
  const snackbar = useSnackbar();
  const state = reactive({
    form: {
      nickname: "用户14325",
      phone: "18301983192",
      email: "18301983192@qq.com",
      registerDate: "2021-04-02",
      avatar: "", // or default avatar URL
      signature: "世界这么大我想去看看",
      promotionLink: "https://www.leiphone.com/author/qiaoyan277",
    },
    loading: false,
    valid: false,
  });

  const uploadAvatar = () => {
    // Trigger file picker or navigate to upload logic
    alert("上传头像点击");
  };
</script>
<template>
  <v-card
    flat
    color="transparent"
  >
    <v-row dense>
      <v-col cols="12">
        <h6 class="text-h6 font-weight-bold">基本信息</h6>
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
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">昵称</label>
            <v-text-field
              v-model="state.form.nickname"
              hide-details
              hide-label
              variant="outlined"
              density="compact"
            />
          </div>
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">手机号</label>
            <v-text-field
              v-model="state.form.phone"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
            />
          </div>

          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">邮箱</label>
            <v-text-field
              v-model="state.form.email"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
            />
          </div>

          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">注册时间</label>
            <v-text-field
              v-model="state.form.registerDate"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
            />
          </div>

          <!-- 头像上传 -->
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">头像：</label>
            <div class="d-flex flex-column ga-2">
              <v-avatar size="100">
                <v-img :src="state.form.avatar || defaultAvatar" />
              </v-avatar>
              <v-btn
                class="mt-2 elevation-0"
                color="primary"
                density="comfortable"
                @click="uploadAvatar"
              >
                上传头像
              </v-btn>
            </div>
          </div>

          <!-- 个性签名 -->
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">个性签名</label>
            <v-text-field
              v-model="state.form.signature"
              density="compact"
              variant="outlined"
              counter="30"
              persistent-counter
            />
          </div>
          <!-- 推广链接 -->
          <div class="mb-4 text-field">
            <label class="text-subtitle-1 mb-1 d-block">推广链接</label>
            <v-text-field
              v-model="state.form.promotionLink"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
            />
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped lang="scss">
  .text-field {
    display: flex;
    align-content: center;
    gap: 8px;
    label {
      text-align: end;
      width: 100px;
    }
  }
</style>
