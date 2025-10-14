export default defineNuxtPlugin((nuxtApp) => {
  const headers = useRequestHeaders(['user-agent']);
  const ua = headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

  useState('platform', () => (isMobile ? 'phone' : 'desktop'));
});
