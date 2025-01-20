<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  currentList: Object,
  defaultListId: String,
  hideOrShow: String
})

const emit = defineEmits(['makeDefault', 'toggleCollapse', 'deleteList'])

const onMakeDefault = () => {
  emit('makeDefault')
}

const toggleListCollapse = () => {
  emit('toggleCollapse')
}

const onDeleteList = () => {
  emit('deleteList')
}
</script>

<template>
  <div class="sl-footer">
    <div class="list-edit-default" @click="onMakeDefault()">
      <div class="default-circle" :class="{ on: defaultListId === currentList?.id }"></div>
      Default
    </div>
    <div class="list-edit-alter">
      <div class="list-edit" @click="toggleListCollapse()">{{ hideOrShow }}</div>
      <div class="list-edit" @click="onDeleteList()">Delete</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use '@/assets/variables' as *

.sl-footer
  display: flex
  height: 50px

.list-edit, .list-edit-default
  background: $colorLighter
  color: $colorDarkest
  width: 50px
  height: 50px
  text-align: center
  padding: 15px 0
  cursor: pointer
  border-radius: 0 0 2px 2px
  border: 1px solid #ccc
  display: flex
  justify-content: center
  align-items: center
  flex-grow: 1

.list-edit-default
  flex-grow: 2

.list-edit-alter
  display: flex
  flex-grow: 1

.default-circle
  border-radius: 50%
  width: 10px
  height: 10px
  background: grey
  margin-right: 10px

  &.on
    background: green
</style>
