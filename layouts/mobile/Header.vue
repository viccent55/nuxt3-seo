<script setup lang="ts"></script>
<template>
  <v-app-bar
    flat
    app
    color="surface"
    class="border-b app-header"
  >
    <!-- Left: Logo -->
    <MobileSearch />
    <ButtonColor></ButtonColor>
  </v-app-bar>
  <DialogInfo ref="dialgInfo" />
  <GuideIos ref="dialogIosGuide" />
  <MobilePopupSearch />
</template>

<style lang="scss" scoped>
  /* In your main CSS file or header component <style> */
  .app-header {
  }

  .custom-dropdown {
    width: 160px;
  }
</style>
