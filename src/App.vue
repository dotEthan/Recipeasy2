<script setup lang="ts">
import { RouterView } from "vue-router";

import { onBeforeMount } from "vue";

import HeaderComponent from "@/components/core/header/HeaderComponent.vue";
import AppOverlays from "@/components/core/shared/appOverlays/AppOverlays.vue";
import { useAppService } from "@/composables/useAppService";

const appService = useAppService();

onBeforeMount(async () => {
  await appService.initializeApp();
});
</script>

<template>
  <div class="bg-primary font-main text-surface h-[100dvh]">
    <HeaderComponent />
    <div class="overflow-y-auto h-full">
      <RouterView />
    </div>
    <AppOverlays />
  </div>
</template>

<style lang="sass" scoped></style>
