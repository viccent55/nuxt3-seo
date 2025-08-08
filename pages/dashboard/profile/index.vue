<script lang="ts" setup>
  import { useStore } from "~/store";

  const form = ref();
  const snackbar = useSnackbar();
  const state = reactive({
    form: {
      nickname: "",
      phone: "18301983192",
      email: "",
      registerDate: "",
      avatar: "", // or default avatar URL
      signature: "",
      promotionLink: "",
      slogan: "",
    },
    loading: false,
    valid: false,
  });
  const fileInput = ref<HTMLInputElement | null>(null);
  const store = useStore();
  const uploadAvatar = () => {
    fileInput.value?.click();
  };
  const onFileSelected = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      state.form.avatar = base64;
    };

    reader.readAsDataURL(file);
  };
  const onSave = async () => {
    // The composable is called, but the request isn't made yet.
    // The request is executed by calling .execute()
    const response = await useApiFetch("/api/member/profile", {
      method: "POST",
      body: state.form,
    });

    console.log(response);
  };

  onMounted(() => {
    state.form.avatar = store.userInfo.avatar;
    state.form.email = store.userInfo.email;
    state.form.nickname = store.userInfo.nickname;
    state.form.phone = store.userInfo.phone;
    state.form.registerDate = store.userInfo.register_date;
    state.form.signature = store.userInfo.signature;
    state.form.promotionLink = store.userInfo.promotion_link;
  });
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
              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="onFileSelected"
              />
              <v-avatar size="80">
                <v-img :src="state.form.avatar || '/images/no-image.png'" />
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
            />
          </div>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        align="center"
      >
        <v-btn
          color="primary"
          elevation="0"
          @click="onSave"
          width="200"
          density="default"
        >
          提交
        </v-btn>
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
