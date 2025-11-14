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
  <header>
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
  </header>
</template>

<style lang="scss" scoped>
  /* In your main CSS file or header component <style> */
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    /* Add padding equal to the top safe area inset */
    padding-top: var(--safe-area-inset-top, 0px);
    /* If you want the height to be dynamic: */
    // height: calc(60px + var(safe-area-inset-top, 0px));
    /* '56px' is an example of your header's base height */
  }

  .custom-dropdown {
    width: 160px;
  }
</style>
