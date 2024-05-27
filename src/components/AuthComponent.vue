<template>
    <div v-if="loading">
        <v-overlay :model-value="loading" class="align-center justify-center">
            <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        </v-overlay>
    </div>
    <div v-if="error">Authentication failed: {{ error.message }}</div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserData } from '@/stores/UserDataStore';
import useAPICall from '@/composables/useAPICall';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const userStore = useUserData();

const { APIResponse, HTTPResponseCode, APICall, loading, error } = useAPICall();

const token = decodeURIComponent(route.params.token);

const authenticateUser = async () => {

    await APICall({
        endpoint: '/authenticate',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'POST'
    }); 

    if (HTTPResponseCode.value === 200) {
        userStore.setUserData({
            token: APIResponse.value.token,
            firstName: APIResponse.value.user.name,
            lastName: APIResponse.value.user.surname,
            userEmail: APIResponse.value.user.email,
            userAvatar: APIResponse.value.avatar,
            userId: APIResponse.value.user.id,
            loggedIn: true,
        });
        router.push('/');
    }
};

onMounted(() => {
    authenticateUser();
});
</script>
