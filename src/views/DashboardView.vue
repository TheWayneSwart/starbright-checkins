<template>

    <v-progress-linear v-if="loading" color="blue-lighten-1" indeterminate></v-progress-linear>

    <v-row v-if="!loading" class="mt-5 justify-center">
        <v-col md="8">

            <v-row class="justify-center">
                <v-col cols="12" md="6">
                    <v-autocomplete label="Search" :clear-on-select="true" :items="clients" item-title="company_name"
                        item-value="client_id" prepend-inner-icon="mdi-magnify" @update:modelValue="openSearch">
                    </v-autocomplete>
                </v-col>
            </v-row>

            <v-table class="hover-table">
                <thead>
                    <tr>
                        <th class="text-left">Client company</th>
                        <th class="text-center">Your last checkin</th>
                        <th class="text-center">Total checkins</th>
                        <th class="text-center">Services</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="client in paginatedClients" :key="client.client_id">
                        <td class="py-3"
                            style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            <a class="text-body-1 interactable-item" @click="setActiveClient(client.client_id)">{{ client.company_name }}</a>
                        </td>
                        <td class="text-center">
                            <span v-if="!client.logged_in_user_last_checkin" class="text-secondary">Never</span>
                            <span v-else="client.logged_in_user_last_checkin.days"
                                :class="client.logged_in_user_last_checkin.days >= checkinDaysThreshold ? 'text-danger' : 'text-success'">{{
                                    client.logged_in_user_last_checkin.days + ' days' }}</span>
                        </td>
                        <td class="text-center">{{ client.total_checkins }}</td>
                        <td class="text-center">
                            <v-dialog max-width="800">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn v-bind="activatorProps" variant="tonal" color="secondary"
                                        :text="client.services.length + ' services'"></v-btn>
                                </template>
                                <template v-slot:default="{ isActive }">
                                    <v-card>
                                        <v-card-title class="mb-0">{{ client.company_name }}</v-card-title>
                                        <v-card-subtitle>Marketing services</v-card-subtitle>
                                        <v-card-text>
                                            <v-list>
                                                <v-list-item v-for="(service, index) in client.services" :key="index"
                                                    :title="service.core_service_name" :subtitle="service.description">
                                                    <template v-slot:prepend>
                                                        <v-icon :icon="service.icon"></v-icon>
                                                    </template>
                                                    <v-divider :thickness="1" class="mt-2 border-opacity-25"
                                                        color="secondary"></v-divider>
                                                </v-list-item>
                                            </v-list>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn text="Close" @click="isActive.value = false"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <v-pagination class="mt-3" v-model="currentPage" :length="totalPages" :total-visible="8"
                @input="updatePage"></v-pagination>
        </v-col>
    </v-row>
</template>

<script setup>
import useAPICall from '@/composables/useAPICall'
import { useUserStore } from '@/stores/User'
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/Client'

const { APIResponse, HTTPResponseCode, APICall, loading, error } = useAPICall();
const clientStore = useClientStore();
const userStore = useUserStore();
const router = useRouter();
const clients = ref([]);
const checkinDaysThreshold = ref(process.env.VUE_APP_CHECKIN_DAYS_THRESHOLD);

const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() => {
    return Math.ceil(clients.value.length / itemsPerPage.value);
});

const paginatedClients = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return clients.value.slice(start, end);
});

// Search
const openSearch = (clientId) => {
    if (clientId) {
        clientStore.setClientId(clientId);
        userStore.setView('details');
    }
};

const fetchClients = async () => {
    await APICall({
        endpoint: '/dashboardclients',
        headers: {
            Authorization: `Bearer ${userStore.token}`,
        },
        method: 'GET'
    });

    if (HTTPResponseCode.value === 200 && APIResponse.value.clients) {
        clients.value = APIResponse.value.clients;
    } else {
        console.error(error);
    }
};

// Set the active clientId
const setActiveClient = (clientId) => {
    clientStore.setClientId(clientId);
    userStore.setView('details');
}

// Watch for changes in the isLoggedIn state

onMounted(() => {
    fetchClients();
});

const updatePage = (page) => {
    currentPage.value = page;
};
</script>

<style scoped>
.interactable-item {
    cursor: pointer;
}
</style>
