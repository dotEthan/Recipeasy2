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
  <div class="bg-primary text-surface">
    <HeaderComponent />
    <div class="h-[100dvh]">
      <div class="overflow-y-auto h-full">
        <RouterView />
      </div>
    </div>
    <AppOverlays />
  </div>
</template>

<style lang="sass" scoped></style>
