<script setup lang="ts">
/**
 * Toast connected to toastStore for displaying non-critical user notifications
 * @todo remove radix-vue
 * @example
 * <CheckboxComponent
      :checkboxLabel="type"
      @update:modelValue="(isSelected) => updateMealType(type, isSelected)"
    />
 */
import { Check } from "lucide-vue-next";
import { CheckboxIndicator, CheckboxRoot } from "radix-vue";

import { ref, watch } from "vue";

const props = defineProps({
  checkboxLabel: String,
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isChecked = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isChecked.value = newValue;
  }
);

function toggleCheckbox() {
  isChecked.value = !isChecked.value;
  emit("update:modelValue", isChecked.value);
}
</script>

<template>
  <label>
    <CheckboxRoot :checked="isChecked" @update:checked="toggleCheckbox" class="checkboxRoot">
      <CheckboxIndicator class="checkboxIndicator"> <Check v-if="isChecked" /> </CheckboxIndicator>
    </CheckboxRoot>
    <span class="label">{{ checkboxLabel }}</span>
  </label>
</template>

<style lang="sass" scoped>

label
  display: flex
  align-items: center
  text-transform: capitalize

/* reset */
button
  all: unset


.checkboxRoot
  background-color: white
  width: 25px
  height: 25px
  border-radius: 4px
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 2px 10px var(--black-a7)

.checkboxRoot:hover
  background-color: black

.checkboxRoot:focus
  box-shadow: 0 0 0 2px black


.checkboxIndicator
  color: blue
  border: 1px solid black
  width: 50px


.label
  color: black
  padding-left: 15px
  font-size: 15px
  line-height: 1
</style>
