<script lang="ts" setup>
import { ref } from 'vue';

useHead({
  title: '联系我们',
  meta: [
    { name: 'description', content: '有任何问题或建议？请通过以下方式联系我们，或填写联系表单，我们会尽快回复您。' }
  ]
});

const form = ref(null);
const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');
const loading = ref(false);

const nameRules = [
  (v: string) => !!v || '姓名不能为空',
];
const emailRules = [
  (v: string) => !!v || '邮箱不能为空',
  (v: string) => /.+@.+\..+/.test(v) || '邮箱格式不正确',
];
const subjectRules = [
  (v: string) => !!v || '主题不能为空',
];
const messageRules = [
  (v: string) => !!v || '内容不能为空',
];

const submit = async () => {
  // In a real app, you would validate and then send the form data to your server.
  // For this example, we'll just log it and simulate a network request.
  // const { valid } = await form.value.validate();
  // if (!valid) return;
  
  loading.value = true;
  console.log({
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
  });

  setTimeout(() => {
    loading.value = false;
    // Here you might show a success message and reset the form
    // form.value.reset();
  }, 2000);
};
</script>

<template>
  <v-container>
    <v-row justify="center" class="my-md-10 my-5">
      <v-col cols="12" md="10" lg="8">
        <v-card flat color="transparent">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">
            联系我们
          </v-card-title>
          <v-card-subtitle class="text-center text-medium-emphasis mb-10">
            我们很乐意收到您的来信！
          </v-card-subtitle>

          <v-row>
            <!-- Contact Info -->
            <v-col cols="12" md="5">
              <h3 class="text-h6 font-weight-medium mb-6">联系信息</h3>
              <div class="d-flex align-start mb-6">
                <v-icon color="primary" class="mr-4 mt-1">mdi-map-marker-outline</v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">地址</div>
                  <div class="text-body-2 text-medium-emphasis">山东省临沂市兰山区XX路123号</div>
                </div>
              </div>
              <div class="d-flex align-start mb-6">
                <v-icon color="primary" class="mr-4 mt-1">mdi-email-outline</v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">电子邮箱</div>
                  <div class="text-body-2 text-medium-emphasis">contact@example.com</div>
                </div>
              </div>
              <div class="d-flex align-start mb-6">
                <v-icon color="primary" class="mr-4 mt-1">mdi-phone-outline</v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">电话</div>
                  <div class="text-body-2 text-medium-emphasis">+86 123 4567 8900</div>
                </div>
              </div>
            </v-col>

            <!-- Contact Form -->
            <v-col cols="12" md="7">
              <h3 class="text-h6 font-weight-medium mb-6">发送消息</h3>
              <v-form ref="form" @submit.prevent="submit">
                <v-text-field v-model="name" :rules="nameRules" label="您的姓名" variant="outlined" density="comfortable" class="mb-4" required />
                <v-text-field v-model="email" :rules="emailRules" label="您的邮箱" variant="outlined" density="comfortable" class="mb-4" required />
                <v-text-field v-model="subject" :rules="subjectRules" label="主题" variant="outlined" density="comfortable" class="mb-4" required />
                <v-textarea v-model="message" :rules="messageRules" label="您的留言" variant="outlined" density="comfortable" rows="5" required />
                <v-btn :loading="loading" type="submit" color="primary" size="large" block>
                  发送
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>