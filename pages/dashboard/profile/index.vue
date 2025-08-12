<script lang="ts" setup>
  import { MobileSettingProfile } from "#components";

  const { isMobile } = useVariable();
</script>
<template>
  <MobileSettingProfile v-if="isMobile" />
  <DesktopSettingProfile v-else />
</template>
<style scoped lang="scss">
  .text-field {
    display: flex;
    align-content: center;
    gap: 8px;
    label {
      text-align: end;
      width: 100px;
    }
  }
</style>
