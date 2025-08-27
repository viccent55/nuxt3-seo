<script lang="ts" setup>
  import { NuxtLink } from "#components";
  import { useStore } from "~/store";

  const store = useStore();
  const state = reactive({
    bottom_menu: [] as { name: string; url: string }[],
    friend_link: [] as { name: string; url: string }[],
  });
  watch(
    () => store.configuration,
    (v) => {
      if (v.bottom_menu) {
        const result = v.bottom_menu.split("\n").map((line: string) => {
          const [name, url] = line.split("|");
          return {
            name,
            url: url.startsWith("/page/") ? url.replace("/page", "") : url,
          };
        });

        state.bottom_menu = result;
      }
      if (v.friend_link) {
        state.friend_link = v.friend_link;
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
</script>

<template>
  <v-container
    fluid
    class="bg-background pa-0"
  >
    <v-footer>
      <v-row
        dense
        class="pa-4"
      >
        <v-col
          cols="12"
          v-if="$route.name == 'index'"
        >
          <div class="d-flex flex-wrap flex-grow-1 ga-3 ga-md-8">
            <div class="d-flex gap-md-5 flex-grow-1 ga-3 justify-center">
              <NuxtLink
                v-for="item in state.bottom_menu"
                :key="item.name"
                :to="item.url"
                class="text-decoration-none text-surface-variant"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          v-if="$route.name == 'index'"
        >
          <div class="d-flex w-100">
            <div
              class="d-flex ga-md-5 flex-grow-1 ga-3 text-caption justify-center"
            >
              <div class="text-body-2">友情链接 :</div>
              <NuxtLink
                v-for="(item, index) in state.friend_link"
                :key="index"
                :to="item.url"
                class="text-decoration-none text-surface-variant"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          align="center"
        >
          <v-sheet>
            {{ store.configuration?.copyright || "--" }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>
