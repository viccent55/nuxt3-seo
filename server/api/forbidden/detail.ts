import { faker } from "@faker-js/faker";
import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  // During development, we can return mock data.
  const config = useRuntimeConfig();
  if (config.public.apiTest) {
    const list = {
      id: 1,
      category_id: 1,
      title: faker.commerce.productName(),
      cover: faker.image.url(),
      cover_w: "200",
      cover_h: "200",
      like_count: faker.number.int({ min: 100, max: 1000 }),
      star_count: faker.number.int({ min: 100, max: 1000 }),
      view_count: faker.number.int({ min: 100, max: 1000 }),
      m3u8: "https://video.cgtt.live/video_up/be3/29e/539a5eb975221ac0b5feda1cd331325d9d882ee414329ae733eccc37b1/video.m3u8?token=826511b4ac217dd9c76d2c60cda56804b2d89739d6655e3304f3fa9e731388fb",
      is_hot: faker.datatype.boolean({ probability: 0.5 }),
      access_type: faker.number.int({ min: 1, max: 3 }),
      seo_keywords: faker.lorem.words(),
      seo_description: faker.lorem.paragraph(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.past().toISOString(),
    };

    return dataEncrypt({
      data: list,
      errorcode: 0,
      info: "",
    });
  }

  // In production, proxy the request to the actual backend API.
  const baseURL = config.public.apiBase;
  return proxyRequest(event, `${baseURL}/forbiddenVideo/detail`);
});
