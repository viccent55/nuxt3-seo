import { faker } from "@faker-js/faker";
import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // During development, we can return mock data.
  if (config.public.apiTest) {
    const list = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      name: faker.commerce.department(),
      slug: faker.lorem.slug(),
      sort: i + 1,
    }));

    return dataEncrypt({
      data: list,
      errorcode: 0,
      info: "",
    });
  }

  // In production, proxy the request to the actual backend API.

  const baseURL = config.public.apiBase;
  return proxyRequest(event, `${baseURL}/forbiddenVideo/category`);
});
