<script setup lang="ts">
  import { useStore } from "~/store";

  const store = useStore();
  const form = ref();
  const state = reactive({
    form: {
      status: "",
      email: "",
      code: "",
    },
    valid: true,
    rules: {
      email: [
        (v: string) => !!v || "需要电子邮箱",
        (v: string) => /.+@.+\..+/.test(v) || "电子邮箱必须有效",
      ],
    },
  });

  const getCode = () => {
    // Logic to send verification code
    alert(`验证码已发送到: ${state.form.email}`);
  };

  const subscribe = async () => {
    // subscribe logic
    alert("你已取消订阅");
    const response = await useApiFetch("/api/member/subscribe", {
      method: "POST",
      body: state.form,
    });
    console.log("subsribe", response);
  };
  const unsubscribe = () => {
    // Unsubscribe logic
    alert("你已取消订阅");
  };
  onMounted(() => {
    state.form.email = store.userInfo.email;
  });
</script>
<template>
  <v-card
    color="transparent"
    elevation="0"
  >
    <h6 class="text-h6 font-weight-bold">邮箱订阅管理</h6>
    <v-divider></v-divider>

    <v-form
      ref="form"
      class="mt-6"
      style="max-width: 500px"
      lazy-validation
      v-model="state.valid"
    >
      <v-row dense>
        <v-col cols="12">
          <!-- 订阅状态 -->
          <div class="d-flex align-center mb-4">
            <span class="me-2">订阅状态：</span>
            <span class="text-grey">已订阅</span>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="text-field">
            <v-text-field
              v-model="state.form.email"
              :rules="state.rules.email"
              density="compact"
              label="邮箱地址"
              placeholder="请输入你的邮箱地址"
              variant="outlined"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <!-- 验证码 和 按钮 -->
          <div class="d-flex align-center">
            <v-text-field
              v-model="state.form.code"
              label="验证码"
              placeholder="输入验证码"
              variant="outlined"
              density="compact"
              class="flex-grow-1 me-2"
              hide-details
            />
            <v-btn
              color="primary"
              @click="getCode"
              variant="outlined"
            >
              获取验证码
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12">
          <!-- 取消订阅 -->
          <div class="d-flex justify-center">
            <v-btn
              v-if="store.userInfo?.subscribed === 1"
              color="error"
              @click="unsubscribe"
            >
              取消订阅
            </v-btn>
            <v-btn
              v-else
              class="mt-6"
              color="primary"
              @click="subscribe"
            >
              取消订阅
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
