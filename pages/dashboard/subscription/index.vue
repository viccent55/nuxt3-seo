<script setup lang="ts">
  import { ref } from "vue";

  const state = reactive({
    form: {
      status: "",
      email: "",
      code: "",
    },
  });

  const getCode = () => {
    // Logic to send verification code
    alert(`验证码已发送到: ${state.form.email}`);
  };

  const unsubscribe = () => {
    // Unsubscribe logic
    alert("你已取消订阅");
  };
</script>
<template>
  <v-card
    color="transparent"
    elevation="0"
  >
    <h6 class="text-h6 font-weight-bold">邮箱订阅管理</h6>
    <v-divider></v-divider>

    <v-form
      class="mt-6"
      style="max-width: 500px"
    >
      <!-- 订阅状态 -->
      <div class="d-flex align-center mb-4">
        <span class="me-2">订阅状态：</span>
        <span class="text-grey">已订阅</span>
      </div>
      <div class="mb-4 text-field">
        <label class="text-subtitle-1 mb-1 d-block">邮箱地址:</label>
        <v-text-field
          v-model="state.form.status"
          density="compact"
          placeholder="请输入你的邮箱地址"
          variant="outlined"
          hide-details
          class="mb-4"
        />
      </div>

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

      <!-- 取消订阅 -->
      <div class="d-flex justify-center">
        <v-btn
          class="mt-6"
          color="primary"
          @click="unsubscribe"
        >
          取消订阅
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>
