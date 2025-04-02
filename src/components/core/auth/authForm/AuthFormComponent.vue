<script setup lang="ts">
import { FormData, FormField } from '@/types/authFormConfig'
import { reactive } from 'vue';

const props = defineProps<{
  fields: Array<FormField>,
  buttonText: string,
  error: string
}>();

const emit = defineEmits(['submit']);

const formData: FormData = reactive({});

for (const field of props.fields) {
  formData[field.name] = '';
}

async function onSubmit(e: any) {
  e.preventDefault();
  emit('submit', {...formData})
}

function validateField(field: FormField) {
  console.log('validating: ', field)
}

function onClose() {
  console.log(close)
}

</script>

<template>
  <div class="back-drop">
    <div class="auth__warning" v-if="error">
      {{ error }}
    </div>
    <form @submit.prevent="onSubmit">
      <div class="form-group" v-for="field in fields" :key="field.name">
          <label :for="field.name" class="auth-form__label">{{ field.label }}</label>
          <input
            :type="field.type"
            :id="field.name"
            @input="validateField(field)"
            class="form-control"
            v-model="formData[field.name]"
          >
          <span v-if="field.warning" class="warning">{{ field.warning }}</span>
      </div>
      <button type="submit">{{ buttonText }}</button>
    </form>
  </div>
</template>

<style lang="sass" scoped>

.auth__warning
    color: red
    font-size: clamp(10px, 1vw, 20px)
    margin: 5px auto 10px
    text-align: center
    border: 1px solid red
    width: 75%
    padding: 5px

    @media (min-width: 768px)
      margin: 25px auto

.form-group
    margin-bottom: 10px

    // @media (min-width: 768px)
    //   margin-bottom: 15px

.auth-form__label
    font-weight: 700
    margin-bottom: 5px

input.ng-invalid.ng-touched
    border: 1px solid red

    &+.email-warning
        display: block

.form-control
    display: block
    width: 100%
    height: 2em
    padding: 6px 12px
    margin-top: 0

    @media (min-width: 768px)
        height: 3em
        margin-top: 10px

.email-warning
    display: none
    margin-top: 5px
    color: red
    font-size: .8em


.btn
    padding: 3px 6px
    color: #fff
    background-color: #337ab7
    border-color: #2e6da4

    @media (min-width: 768px)
        padding: 6px 12px

</style>