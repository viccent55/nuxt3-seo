import { useDisplay } from "vuetify";

export const useLayoutManager = () => {
  // Use useState to create a state that is shared between server and client
  const layoutName = useState<"desktop" | "mobile">(
    "layout-name",
    () => "desktop"
  );

  const { smAndDown } = useDisplay();
  watchEffect(() => {
    layoutName.value = smAndDown.value ? "mobile" : "desktop";
  });

  return { layoutName };
};
