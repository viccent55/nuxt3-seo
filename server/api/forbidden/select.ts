import { faker } from "@faker-js/faker";
import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  // During development, we can return mock data.
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiMember
    : config.public.apiBase;
  if (config.public.apiTest) {
    const list = Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      category_id: i + 1,
      title: faker.commerce.productName(),
      cover: faker.image.url(),
      cover_w: "200",
      cover_h: "200",
      like_count: faker.number.int({ min: 100, max: 1000 }),
      star_count: faker.number.int({ min: 100, max: 1000 }),
      view_count: faker.number.int({ min: 100, max: 1000 }),
      is_hot: faker.datatype.boolean({ probability: 0.5 }),
      access_type: faker.number.int({ min: 1, max: 3 }),
      sort: i + 1,
      status: faker.number.int({ min: 1, max: 3 }),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.past().toISOString(),
    }));

    return dataEncrypt({
      data: list,
      errorcode: 0,
      info: "",
    });
  }
  return proxyRequest(event, `${baseURL}/forbiddenVideo/select`);
});
