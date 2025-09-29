<script setup lang="ts">
/**
 * Component used to display request for user to register where buttons usually are
 * @example
 *  <PublicRecipeManageButtonsComponent />
 */

const openRegistration = () => {
  console.log("opening");
};
</script>

<template>
  <div
    class="w-full flex flex-row justify-around bg-surface text-primary h-20 border-2 border-solid border-accent cursor-pointer">
    <button>Register today to track, share and find new great recipes!</button>
  </div>
</template>

<style lang="sass" scoped></style>
