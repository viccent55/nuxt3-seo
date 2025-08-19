<script lang="ts" setup>
import { ref } from 'vue';

useHead({
  title: '关于我们',
  meta: [
    { name: 'description', content: '了解更多关于我们的信息，我们的团队以及我们的使命。' }
  ]
});

const team = ref([
  {
    name: '张三',
    role: '创始人 & CEO',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    name: '李四',
    role: '首席技术官',
    avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
  },
  {
    name: '王五',
    role: '运营总监',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
  }
]);
</script>

<template>
  <v-container>
    <v-row justify="center" class="my-md-10 my-5">
      <v-col cols="12" md="10" lg="8">
        <v-card flat color="transparent">
          <v-card-title class="text-h4 font-weight-bold text-center mb-8">
            关于我们
          </v-card-title>

          <v-card-text class="text-body-1 text-medium-emphasis text-center" style="max-width: 700px; margin: 0 auto;">
            <p class="mb-4">
              欢迎来到我们的网站！我们致力于提供最优质的内容和服务。我们的平台汇集了各种精彩的文章、专题和人物介绍，希望能为您带来独特的阅读体验。
            </p>
            <p>
              我们的使命是连接创作者与读者，打造一个充满活力和创造力的内容社区。我们相信，每个人都有故事可以分享，每个故事都值得被听见。
            </p>
          </v-card-text>

          <v-divider class="my-12"></v-divider>

          <h2 class="text-h5 font-weight-bold text-center mb-10">我们的团队</h2>

          <v-row>
            <v-col v-for="member in team" :key="member.name" cols="12" sm="4">
              <div class="text-center">
                <v-avatar size="120" class="mb-4 elevation-2">
                  <v-img :src="member.avatar" :alt="member.name"></v-img>
                </v-avatar>
                <div class="text-h6">{{ member.name }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ member.role }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
