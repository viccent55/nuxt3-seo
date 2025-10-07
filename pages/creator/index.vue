<script setup lang="ts">
  import { onMounted } from "vue";

  const handleClick = () => {
    window.open("https://t.me/HFDHG9985", "_blank");
  };

  onMounted(() => {});
</script>

<template>
  <div class="creator-page-wrapper">
    <div class="creator-background" />
    <v-container
      fluid
      class="py-3 px-5 content-container"
      style="min-height: calc(100vh - 80px)"
    >
      <v-row
        justify="center"
        align="center"
        class="h-100"
        dense
      >
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="creator-card"
            @click="handleClick"
          >
            <!-- Creator Image -->
            <v-img
              src="/creator.jpg"
              lazy-src="/creator.jpg"
              contain
              height="50%"
              class="rounded-lg"
            >
              <!-- Placeholder slot -->
              <template #placeholder>
                <div class="image-slot">Loading...</div>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
  .creator-page-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .creator-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/creator.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    filter: blur(4px) brightness(0.7);
    z-index: 0;
  }

  .content-container {
    position: relative;
    z-index: 1;
  }

  .creator-card {
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .creator-card:hover {
    transform: translateY(-4px);
  }
</style>
