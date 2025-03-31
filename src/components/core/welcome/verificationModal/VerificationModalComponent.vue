<script setup lang="ts">
import axios from '@/axios';
import AppModalComponent from '../../shared/appModal/AppModalComponent.vue';
import { useAuthService } from '@/composables/useAuthService';
import { ref } from 'vue';

const authService = useAuthService();

const codes = ref(Array(6).fill(''));

const handleSubmit = async () => {
    authService.verifyUser(codes.value.join(""));
}
// TODO Style and make work properly
</script>

<template>
    <AppModalComponent>
        <h1>Recipeasy</h1>
        
        <form method="dialog"  @submit="handleSubmit">
            <input v-for="n in 6" v-bind:key="n" type="number" v-model="codes[n-1]">
            <button type="submit">Verify</button>
        </form>
    </AppModalComponent>
</template>

<style lang="sass" scoped>
</style>