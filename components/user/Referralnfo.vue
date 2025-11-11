<script lang="ts" setup>
  const props = defineProps({
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  });
  const qrcodeShare = useTemplateRef("qrcodeShare");
  const onOpenQrcode = () => {
    qrcodeShare.value?.open();
  };
</script>
<template>
  <v-card
    class="mt-4 invite-gradient"
    height="120"
    rounded="lg"
    elevation="4"
  >
    <div class="d-flex align-center justify-space-between h-100 px-4 px-md-12">
      <v-avatar
        size="70"
        class="elevation-2"
      >
        <v-img
          src="/icons/icon-128.webp"
          cover
        />
      </v-avatar>
      <div>
        <div class="text-h6 font-weight-bold white--text">
          成功邀请 {{ userInfo.invite_count || 0 }}人
        </div>
        <div class="text-caption white--text opacity-80">
          永久解锁禁区观影权限
        </div>
      </div>

      <v-btn
        rounded="pill"
        variant="elevated"
        elevation="0"
        color="white "
        class="px-5"
        density="comfortable"
        @click="onOpenQrcode"
      >
        <span class="text-primary">立即邀请</span>
      </v-btn>
    </div>
  </v-card>
  <UserQrcodeShare ref="qrcodeShare"></UserQrcodeShare>
</template>

<style scoped lang="scss">
  .invite-gradient {
    background: linear-gradient(45deg, #fec1c1, #852309);
  }
</style>
