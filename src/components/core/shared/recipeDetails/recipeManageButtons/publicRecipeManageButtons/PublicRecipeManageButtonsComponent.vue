<script setup lang="ts">
/**
 * Component used to display request for user to register where buttons usually are
 * @example
 *  <PublicRecipeManageButtonsComponent />
 */
import { useAppStore } from "@/stores/appStore";
import { useRecipeStore } from "@/stores/recipeStore";

import ButtonComponent from "../../../button/ButtonComponent.vue";

const appStore = useAppStore();
const recipeStore = useRecipeStore();

const openRegistration = () => {
  console.log("opening");
  appStore.setAuthModalType("registration");
  recipeStore.clearSelectedRecipeId();
};
</script>

<template>
  <div
    class="w-full flex flex-row justify-between items-center bg-surface text-primary h-20 border-b-2 border-l-2 border-r-2 border-solid border-accent">
    <div class="grow ml-4 md:ml-10">Register today to track, share and find new great recipes!</div>
    <div class="mr-2 md:mr-10">
      <ButtonComponent
        label="Register Today"
        size="sm"
        :hasIcon="false"
        @click="openRegistration" />
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
