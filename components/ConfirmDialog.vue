<template>
  <v-dialog v-model="internalValue" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ description }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="onCancel">取消</v-btn>
        <v-btn text color="red" @click="onConfirm">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "Warning!" },
  description: { type: String, default: "Are you sure?" },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function onCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}

function onConfirm() {
  emit("confirm");
  emit("update:modelValue", false);
}
</script>
