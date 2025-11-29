import { validateEndpoint } from "@/utils/validate-endpoint";

export default defineEventHandler(async (event) => {
  const endPoint = validateEndpoint( event, `/points/balance`);
  // In production, proxy the request to the actual backend API.
  return proxyRequest(event, endPoint);
});
