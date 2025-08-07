<script lang="ts" setup>
  import { shallowRef } from "vue";

  const loading = shallowRef(false);
  const state = reactive({
    headers: [
      {
        title: "消费时间",
        align: "start",
        key: "name",
      },
      {
        title: "消费金额",
        align: "start",
        key: "year",
      },
      {
        title: "消费类型",
        align: "start",
        key: "engine",
      },
      {
        title: "余额",
        align: "start",
        key: "horsepower",
      },
    ] as const,
    data: [
      {
        name: "Chevrolet Camaro",
        year: 1967,
        engine: "V8",
        horsepower: 375,
      },
      {
        name: "Ford Mustang",
        year: 1965,
        engine: "V8",
        horsepower: 271,
      },
      {
        name: "Dodge Charger",
        year: 1968,
        engine: "V8",
        horsepower: 425,
      },
      {
        name: "Pontiac GTO",
        year: 1964,
        engine: "V8",
        horsepower: 350,
      },
      {
        name: "Plymouth Barracuda",
        year: 1964,
        engine: "V8",
        horsepower: 330,
      },
      {
        name: "Chevrolet Chevelle SS",
        year: 1970,
        engine: "V8",
        horsepower: 450,
      },
      {
        name: "Oldsmobile 442",
        year: 1971,
        engine: "V8",
        horsepower: 340,
      },
      {
        name: "Dodge Challenger",
        year: 1970,
        engine: "V8",
        horsepower: 425,
      },
      {
        name: "AMC Javelin",
        year: 1968,
        engine: "V8",
        horsepower: 315,
      },
      {
        name: "Mercury Cougar",
        year: 1967,
        engine: "V8",
        horsepower: 335,
      },
    ],
  });

  const onClick = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  };
</script>
<template>
  <v-card
    color="transparent"
    elevation="0"
  >
    <div class="text-h6 font-weight-bold">消费记录</div>
    <v-divider></v-divider>
    <v-data-table
      :headers="state.headers"
      :items="state.data"
      :loading="loading"
      class="bg-transparent mt-5"
      :height="`calc(100vh - 320px)`"
      fixed-header
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:item.horsepower="{ value }">
        <div class="text-medium-emphasis">
          <span>{{ value }}</span>

          <v-icon
            icon="mdi-horse-variant-fast"
            end
          ></v-icon>
        </div>
      </template>

      <template v-slot:item.torque="{ value }">
        <div class="text-medium-emphasis">
          <span>{{ value }}</span>

          <v-icon
            icon="mdi-tire"
            end
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
