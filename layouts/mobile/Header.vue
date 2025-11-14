<script setup lang="ts">
  const dialogIosGuide = ref();
  const { isNative } = usePlatform();
  const dialgInfo = ref();
  const displayColor = computed(() => {
    if (isNative.value) {
      return "primary";
    }
    return "surface";
  });
</script>
<template>
  <v-app-bar
    flat
    :color="displayColor"
    class="border-b app-header"
    height="64"
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
    /* Add padding equal to the top safe area inset */
    padding-top: var(--safe-area-inset-top, 0px);
  }

  .custom-dropdown {
    width: 160px;
  }
</style>
