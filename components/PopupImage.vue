<script setup>
  const state = reactive({
    isOpen: false,
    src: "",
  });
  defineExpose({
    open: (src) => {
      state.isOpen = true;
      state.src = src;
    },
    close: () => {
      state.isOpen = false;
      state.src = "";
    },
  });
</script>

<template>
  <v-dialog
    v-model="state.isOpen"
    transition="dialog-bottom-transition"
    content-class="overflow-visible bg-transparent elevation-0"
  >
    <div style="position: relative">
      <v-card
        class="pa-0"
        color="transparent"
        flat
      >
        <Image
          v-if="state.src"
          :src="state.src"
          class="height-dialog"
        />
      </v-card>

      <v-btn
        icon
        variant="flat"
        color="surface"
        class="close-button"
        @click="state.isOpen = false"
        density="comfortable"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-dialog>
</template>

<style scoped lang="scss">
  .main-contain {
    // padding-top: env(safe-area-inset-top, 0px);
    padding-top: var(--safe-area-inset-top, 0px);
    padding-bottom: var(--safe-area-inset-bottom, 0px);
  }

  .close-button {
    position: absolute;
    // Position it at the top center, but outside the card
    top: 0;
    left: 50%;
    transform: translate(-50%, -150%);
    z-index: 20; // Ensure it's above the overlay
  }

  .height-dialog {
    display: block;
    margin-inline: auto;
    width: 100%;
    max-width: 700px;
    aspect-ratio: 400 / 590;
    object-fit: contain;
  }
</style>
