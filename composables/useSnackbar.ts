import { ref } from 'vue';

const snackbar = ref(false);
const text = ref('');
const color = ref('error');
const timeout = ref(5000);

const showSnackbar = (message: string, snackbarColor = 'error') => {
  text.value = message;
  color.value = snackbarColor;
  snackbar.value = true;
};

const useSnackbar = () => {
  return { snackbar, text, color, timeout, showSnackbar };
};

export default useSnackbar;
