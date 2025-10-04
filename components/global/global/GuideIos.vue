<script setup lang="ts">
  import { ref } from "vue";
  import img1 from "/public/guide/step-1.png";
  import img2 from "/public/guide/step-2.png";
  import img3 from "/public/guide/step-3.png";
  import img4 from "/public/guide/step-4.png";

  const showDialog = ref(false);
  const openDialog = () => {
    showDialog.value = true;
  };

  const steps = [
    {
      title: "步骤 1: 点击分享按钮",
      image: img1,
    },
    {
      title: "步骤 2: 选择 '添加到主屏幕'",
      image: img2,
    },
    {
      title: "步骤 3:",
      image: img3,
    },
    {
      title: "步骤 4:",
      image: img4,
    },
  ];

  defineExpose({
    openDialog,
  });
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
  >
    <v-card class="pwa-dialog">
      <v-card-text>
        <!-- Carousel -->
        <v-carousel
          hide-delimiter-background
          :show-arrows="false"
          height="400"
          ref="carousel"
          color="primary"
        >
          <v-carousel-item
            v-for="(step, index) in steps"
            :key="index"
          >
            <h4 class="text-center">{{ step.title }}</h4>
            <v-img
              :src="step.image"
              contain
              height="300"
            />
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .pwa-dialog {
    border-radius: 12px;
  }
</style>
