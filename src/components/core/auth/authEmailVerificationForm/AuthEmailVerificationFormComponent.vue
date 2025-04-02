<script setup lang="ts">
import { useAuthService } from '@/composables/useAuthService';
import { useAppStore } from '@/stores/app';
import { ref } from 'vue';

const authService = useAuthService();
const appStore = useAppStore();

const codes = ref(Array(6).fill(''));

const handleSubmit = async () => {
    try {
        await authService.verifyUser(codes.value.join(''));

        appStore.setAuthModalType('login');
    } catch (error) {
        console.log('email verification error: ', error);
    }
}
// TODO Style and make work properly
</script>

<template>
    <h1>Verification Code</h1>
    <h2>Please enter email verification Code</h2>
    
    <form method="dialog"  @submit="handleSubmit">
        <input v-for="n in 6" v-bind:key="n" type="number" v-model="codes[n-1]">
        <button type="submit">Verify</button>
    </form>
</template>

<style lang="sass" scoped>
</style>