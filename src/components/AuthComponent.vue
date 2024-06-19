<template>
    <div v-if="loading">
        <v-overlay :model-value="loading" class="align-center justify-center">
            <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        </v-overlay>
    </div>
    <div v-if="error" class="d-flex">
        <v-card class="text-center ms-auto me-auto mt-8" title="Authentication failed"
            :subtitle="'Response code: ' + HTTPResponseCode" :text="error.message"></v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';
import useAPICall from '@/composables/useAPICall';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const { APIResponse, HTTPResponseCode, APICall, loading, error } = useAPICall();

const token = decodeURIComponent(route.params.token);

const loginFailed = ref(false);

const authenticateUser = async () => {

    await APICall({
        endpoint: '/authenticate',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'POST'
    });

    if (HTTPResponseCode.value === 200) {
        userStore.login({
            token: APIResponse.value.token,
            firstName: APIResponse.value.user.name,
            lastName: APIResponse.value.user.surname,
            userEmail: APIResponse.value.user.email,
            userAvatar: APIResponse.value.avatar,
            userId: APIResponse.value.user.id,
            loggedIn: true,
        });

        router.push('/');
    } else {
        loginFailed.value = true;
    }
};

onMounted(() => {
    authenticateUser();
});
</script>