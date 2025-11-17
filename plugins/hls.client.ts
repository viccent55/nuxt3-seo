import Hls from "hls.js";

export default defineNuxtPlugin(() => {
  return {
    provide: { hls: Hls },
  };
});
