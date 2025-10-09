import { ref } from "vue";

export const screenMode = ref<"pc" | "pad" | "phone">("pc");

function updateScreenMode() {
  if (!process.client) return;
  const width = window.innerWidth;

  if (width >= 960) screenMode.value = "pc";
  else if (width >= 695) screenMode.value = "pad";
  else screenMode.value = "phone";
}

export function initScreenMode() {
  if (!process.client) return;

  updateScreenMode();
  window.addEventListener("resize", updateScreenMode);

  // Cleanup in HMR (optional)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener("resize", updateScreenMode);
    });
  }
}
