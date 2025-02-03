<script setup lang="ts">

defineProps({
  note: String
})

</script>

<template>
  <div class="item-list">
    <div class="item-contain">
      <ul class="items-list">
        <li class="direction-contain">
          <div class="text direction-text">
            - {{ note }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass" scoped>

.direction-contain
  list-style-type: none

.direction-text
  margin-bottom: 10px
</style>
