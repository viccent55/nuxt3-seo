<script setup lang="ts"></script>
<template>
  <v-app-bar
    flat
    color="surface"
    class="border-b app-header"
  >
    <!-- Left: Logo -->
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <MobileSearch />
        </v-col>
      </v-row>
      <ButtonColor></ButtonColor>
    </v-container>
  </v-app-bar>
  <DialogInfo ref="dialgInfo" />
  <GuideIos ref="dialogIosGuide" />
  <MobilePopupSearch />
</template>

<style lang="scss" scoped>
  /* In your main CSS file or header component <style> */
  .app-header {
    position: fixed;
  }

  .custom-dropdown {
    width: 160px;
  }
</style>
