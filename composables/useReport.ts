import { ref } from "vue";
import { setConfig } from "@/utils/statistics";

export function useReport() {
  const isRunning = ref(false);

  const KEY = "last_report_alive";
  const shouldRunToday = () => {
    const last = localStorage.getItem(KEY);
    if (!last) return true;

    const lastDate = new Date(last);
    const now = new Date();

    // Compare YYYY-MM-DD only
    return (
      lastDate.getFullYear() !== now.getFullYear() ||
      lastDate.getMonth() !== now.getMonth() ||
      lastDate.getDate() !== now.getDate()
    );
  };

  const runOncePerDay = async () => {
    if (isRunning.value) return; // prevent double-run
    if (!shouldRunToday()) return; // already ran today
    const config = useRuntimeConfig();
    isRunning.value = true;
    try {
      await setConfig({
        appId: "1234567898765432100",
        productId: "xhslandpage",
        backendURL: config.public.apiTransaction,
        promoCode: "Pim9FD",
        productCode: "xhslandpage",
        actionType: "active",
      });

      // Save today's date
      localStorage.setItem(KEY, new Date().toISOString());
    } catch (e) {
      console.error("setConfig failed:", e);
    } finally {
      isRunning.value = false;
    }
  };

  return { runOncePerDay };
}
