import { computed, onMounted, onUnmounted, ref } from "vue";

import { ScreenSize } from "@/constants";
import { debounce, getCurrentScreenSize } from "@/utilities";

export function useScreenSizeService() {
  // const screenSize = ref<ScreenSize>(ScreenSize.SMALL);
  const screenSize = ref<ScreenSize>("xs");

  const isMobile = computed(() => ["xs", "sm"].includes(screenSize.value));
  const isDesktop = computed(() => ["md", "lg", "xl", "2xl"].includes(screenSize.value));

  const updateSize = () => {
    screenSize.value = getCurrentScreenSize(window.innerWidth);
  };

  const debouncedcall = debounce(updateSize, 100);

  onMounted(() => {
    updateSize();
    window.addEventListener("resize", debouncedcall);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", debouncedcall);
  });

  return {
    screenSize,
    isDesktop,
    isMobile
  };
}
