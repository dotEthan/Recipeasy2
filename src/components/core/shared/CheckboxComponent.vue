<script setup lang="ts">
import { ref } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { Check } from 'lucide-vue-next'
const checkboxOne = ref(true)
defineProps({
  checkboxLabel: String
})
</script>

<template>
  <label>
    <CheckboxRoot v-model:checked="checkboxOne" class="CheckboxRoot">
      <CheckboxIndicator class="CheckboxIndicator">
        <Check />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span class="Label">{{ checkboxLabel }}</span>
  </label>
</template>

<style lang="sass">

label
  display: flex
  align-items: center

/* reset */
button
  all: unset


.CheckboxRoot
  background-color: white
  width: 25px
  height: 25px
  border-radius: 4px
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 2px 10px var(--black-a7)

.CheckboxRoot:hover
  background-color: black

.CheckboxRoot:focus
  box-shadow: 0 0 0 2px black


.CheckboxIndicator
  color: blue


.Label
  color: black
  padding-left: 15px
  font-size: 15px
  line-height: 1
</style>
