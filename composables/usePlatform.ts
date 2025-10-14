// composables/usePlatform.ts
import { Capacitor } from "@capacitor/core";
import { ref, onMounted } from "vue";

export const usePlatform = () => {
  const isNative = ref(false);

  onMounted(async () => {
    try {
      isNative.value = Capacitor.isNativePlatform();
    } catch {
      isNative.value = false;
    }
  });

  return { isNative };
};
