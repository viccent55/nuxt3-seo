<script setup lang="ts">
  import {
    getLogs,
    getBalance,
    reedemPoint,
    getPointConfig,
  } from "~/service/hookup";

  const props = defineProps({
    modelValue: Boolean,
  });
  const emit = defineEmits(["update:modelValue"]);
  const { isMobile } = useVariable();
  const model = computed({
    get: () => props.modelValue,
    set: (v) => emit("update:modelValue", v),
  });

  const state = reactive({
    paginate: {
      page: 1,
      limit: 30,
      type: 1,
    },
    records: [] as EmptyArrayType,
    loading: false,
    balance: 0,
    config: {} as EmptyObjectType,
    hasCheckedInToday: false,
  });

  const snackbar = useSnackbar();

  const checkHasCheckedInToday = (records: any[]) => {
    if (!records || records.length === 0) return false;
    const today = new Date().toISOString().slice(0, 10);
    return records.some((record) => record.created_at.startsWith(today));
  };

  const getTableRecord = async () => {
    state.loading = true;
    state.hasCheckedInToday = false;
    try {
      const response = await getLogs(state.paginate);
      if (response.errcode === 0) {
        state.records = response.data.items;
        // 🧠 Check today’s record
        state.hasCheckedInToday = checkHasCheckedInToday(state.records);
      }
    } catch (e) {
      console.error(e);
    } finally {
      state.loading = false;
    }
  };
  const getCurrentBalance = async () => {
    try {
      const response = await getBalance();
      if (response.errcode == 0) {
        state.balance = response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getConfig = async () => {
    try {
      const response = await getPointConfig();
      if (response.errcode == 0) {
        state.config = response.data ?? {};
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getRedeemPoint = async () => {
    try {
      const response = await reedemPoint();
      if (response.errcode === 0) {
        snackbar.showSnackbar("兑换成功", "success", "top");
        state.hasCheckedInToday = true; // 🟢 Disable button for rest of day
        await getCurrentBalance();
        await getTableRecord();
      } else {
        snackbar.showSnackbar(response.info, "warning", "top");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const closeSheet = () => {
    model.value = false;
  };
  const onInit = () => {
    getCurrentBalance();
    getTableRecord();
    getConfig();
  };
</script>

<template>
  <v-dialog
    v-model="model"
    @after-enter="onInit"
    transition="slide-y-transition"
    max-width="550px"
    :fullscreen="isMobile"
    scrollable
  >
    <v-card
      class="dialog-custom"
      :loading="state.loading"
    >
      <!-- Header -->
      <v-card-title>
        <div class="d-flex align-center justify-space-between text-white">
          <v-btn
            icon="mdi-chevron-left"
            density="compact"
            variant="text"
            @click="closeSheet"
          />
          <div class="text-h6">签到</div>
          <div></div>
        </div>
      </v-card-title>
      <!-- Sign-in grid -->
      <v-card-text class="pt-2 pb-8">
        <v-row class="text-white">
          <v-col cols="12">
            <div>我的积分</div>
            <div class="d-flex justify-space-between align-center">
              <div class="text-h4 font-weight-bold">{{ state?.balance }}</div>
              <v-avatar size="40">
                <img
                  src="/hookgirl/currency.png"
                  alt=""
                />
              </v-avatar>
            </div>
          </v-col>
          <v-col cols="12">
            <v-card
              class="pa-3 rounded-lg"
              color="white"
            >
              <div class="text-subtitle-1 mb-2 font-weight-bold">
                签到领取积分
              </div>
              <div class="mb-4 text-subtitle-2">
                已经签到
                <span class="text-purple font-weight-bold">
                  {{ state.config?.points_per_rmb }}
                </span>
                天领取
                <span class="text-purple font-weight-bold">
                  {{ state.config?.daily_sign_point }}
                </span>
                积分
              </div>

              <v-row
                class="d-flex flex-wrap"
                dense
              >
                <v-col
                  v-for="(point, index) in state.records"
                  :key="index"
                  :cols="isMobile ? 3 : 2"
                  class="mb-2"
                >
                  <v-sheet
                    color="purple-lighten-3"
                    class="d-flex flex-column align-center justify-center px-2 py-3 rounded-lg"
                  >
                    <v-avatar size="20">
                      <img
                        src="/hookgirl/noto_coin.png"
                        alt=""
                      />
                    </v-avatar>
                    <span class="text-subtitle-2">
                      +{{ state.config?.daily_sign_point }}
                    </span>
                    <!-- <span class="text-caption grey--text">第{{}}天</span> -->
                  </v-sheet>
                  <div class="text-center mt-1 f12">
                    {{ point.remark }}
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  align="center"
                >
                  <v-btn
                    color="indigo"
                    width="200px"
                    rounded="xl"
                    size="large"
                    :disabled="
                      state.loading ||
                      state.hasCheckedInToday ||
                      state.records.length > 0
                    "
                    @click="getRedeemPoint"
                  >
                    立即签到
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card rounded="lg">
              <v-card-text class="text-caption grey--text">
                <div>签到规则</div>
                <ol class="pl-4">
                  <li>
                    每日签到得{{ state.config?.daily_sign_point }}积分，{{
                      state.config?.deduct_max_per_time
                    }}积分可抵扣{{
                      state.config?.deduct_max_per_time
                    }}元约炮费用，每次最高抵扣{{
                      state.config?.deduct_max_per_time
                    }}元
                  </li>

                  <li>
                    积分满100可联系客服兑换抵扣,每月可抵扣
                    {{ state.config?.monthly_deduct_limit }}次
                  </li>
                </ol>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
  .dialog-custom {
    padding-top: var(--safe-area-inset-top, 0px);
    padding-bottom: var(--safe-area-inset-bottom, 0px);
    /* from top 30% */
    background: linear-gradient(
      to bottom,
      #5e20ff 0%,
      #633dc6 40%,
      black 40%,
      black 100%
    );
  }
</style>
