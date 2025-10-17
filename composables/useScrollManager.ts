import { ref, computed } from "vue";

// A reactive reference to the current main scrollable element in the app.
const scrollableElement = ref<HTMLElement | null>(null);

// A reactive reference to the vertical scroll position of that element.
const scrollTop = ref(0);

/**
 * A composable to manage the primary scrollable element in the application.
 * This allows components like a "scroll to top" button to interact with
 * whichever component is currently responsible for scrolling, rather than
 * being hard-coded to the `window` object.
 */
export function useScrollManager() {
  const setScrollableElement = (el: HTMLElement | null) => {
    scrollableElement.value = el;
  };

  return { scrollableElement, scrollTop, setScrollableElement };
}
