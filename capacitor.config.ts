import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.NODE_ENV !== "production";
const LAN_IP = "http://192.168.100.106";
const VITE_PORT = 3000;
const LOCAL_URL = `${LAN_IP}:${VITE_PORT}`;
const config: CapacitorConfig = {
  appId: "redbook.xhltbes.app",
  appName: "小红书成人版",
  webDir: ".output/public", // ✅ Nuxt build folder (for production build)
  server: {
    // 👇 Use production site when in production
    url: "https://redbook.xhltbes.com",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // ms
      launchAutoHide: true, // auto hide after web loads
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ffffffff",
    },
  },
};

export default config;
