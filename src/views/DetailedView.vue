<template>

    <NavbarComponent />
    <v-progress-linear v-if="readingClient" color="blue-lighten-1" indeterminate></v-progress-linear>

    <v-container v-if="!readingClient">
        <p class="text-h3 font-weight-bold text-center">{{ companyName }}</p>
        <v-divider class="mb-5 mt-3"></v-divider>
        <v-row class="justify-center">
            <v-col class="me-3 mb-3" cols="12" lg="8">

                <v-btn @click="toggleForm" v-if="!showForm" color="success" class="mb-3">Add checkin</v-btn>               

                <v-form @submit.prevent="submitForm" v-if="showForm" fast-fail>
                    <v-progress-linear v-if="postingForm" color="blue-lighten-1" indeterminate></v-progress-linear>
                    <v-card class="mb-3" :subtitle="`Add the details of your checkin with ${companyName}`"
                        title="Add checkin">
                        <v-row no-gutters>
                            <v-col md="6" cols="12" class="ps-3 pe-3">
                                <v-select multiple chips label="Selected services *" :item-props="true"
                                    :items="formattedClientServices" v-model="selectedServices"
                                    :rules="rules.selectedServices">
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col md="12" cols="12" class="ps-3 pe-3">
                                <v-textarea v-model="checkinDescription" :rules="rules.checkinDescription"
                                    label="Detailed checkin description *" auto-grow></v-textarea>
                            </v-col>
                        </v-row>

                        <template v-slot:actions>
                            <v-btn type="submit" color="primary">Save</v-btn>
                            <v-btn @click="toggleForm">Cancel</v-btn>
                        </template>
                    </v-card>
                </v-form>

                <v-card elevation="16" class="pa-6">
                    <v-timeline v-if="checkIns" side="end">
                        <v-timeline-item v-for="checkIn in checkIns" size="large">
                            <template v-slot:icon>
                                <v-avatar :image="checkIn.user_avatar"></v-avatar>
                            </template>
                            <template v-slot:opposite>
                                <p class="text-center font-weight-bold">{{ checkIn.created_at_date }}</p>
                                <p :class="checkIn.days_ago >= checkinDaysThreshold ? 'text-danger' : 'text-success'"
                                    class="text-center">
                                    {{ checkIn.days_ago + ' days ago' }}
                                </p>
                            </template>
                            <v-card elevation="0">
                                <v-card-title class="text-h5" v-if="checkIn.services.length">
                                    <v-chip v-for="service in checkIn.services" :key="service.id" class="me-2 py-4"
                                        color="light-blue-lighten-2" :prepend-icon="service.icon">
                                        {{ service.core_service_name }}
                                    </v-chip>
                                </v-card-title>
                                <v-chip v-else class="text-secondary py-4" prepend-icon="mdi-crosshairs-question">Unkown
                                    services</v-chip>
                                <v-card-text v-html="checkIn.description"></v-card-text>
                            </v-card>

                        </v-timeline-item>
                    </v-timeline>

                    <v-row v-else class="text-center justify-center">
                        <v-col md="12" width="100%">
                            <v-empty-state icon="mdi-emoticon-sad-outline">
                                <template v-slot:media>
                                    <v-icon color=""></v-icon>
                                </template>

                                <template v-slot:headline>
                                    <div class="text-h4">
                                        No checkins found!
                                    </div>
                                </template>

                                <template v-slot:title>
                                    <div class="text-h6">
                                        There are no historical checkins for {{ companyName }}.
                                    </div>
                                </template>

                                <template v-slot:text>
                                    <div class="text-medium-emphasis text-caption">
                                        To add a checkin for {{ companyName }}, click on the add button.
                                    </div>
                                </template>
                            </v-empty-state>
                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserData } from '@/stores/UserDataStore'
import { nl2br } from '@/utils/nl2br'
import NavbarComponent from '@/components/NavbarComponent'
import useAPICall from '@/composables/useAPICall'

const { APIResponse, HTTPResponseCode, APICall, loading, error } = useAPICall();
const route = useRoute();
const router = useRouter();
const userStore = useUserData();

const selectedServices = ref([]);
const checkinDescription = ref(null);
const companyName = ref(null);
const checkIns = ref(null);
const readingClient = ref(true);
const postingForm = ref(false);
const clientServices = ref(null);
const checkinDaysThreshold = ref(Number(process.env.VUE_APP_CHECKIN_DAYS_THRESHOLD));

// Form validation
const rules = ref({
    checkinDescription: [
        value => {
            if (value) return true
            return 'Please enter a detailed description.'
        }
    ],
    selectedServices: [
        value => {
            if (value.length > 0) return true
            return 'Please select some services.'
        }
    ]
});

const formattedClientServices = computed(() =>
    clientServices.value.map(service => ({
        value: service.id,
        title: service.core_service_name,
        subtitle: service.description
    }))
);

const toggleForm = () => {
    showForm.value = !showForm.value;
}

const fetchClientDetails = async () => {

    try {
        await APICall({
            endpoint: '/clientdetails/' + route.params.clientId,
            headers: {
                Authorization: `Bearer ${userStore.token}`,
            },
            method: 'GET'
        });

        if (HTTPResponseCode.value === 200 && APIResponse.value.client) {
            companyName.value = APIResponse.value.client.company_name;
            clientServices.value = APIResponse.value.services;

            await APICall({
                endpoint: '/fetchhistory',
                headers: {
                    Authorization: `Bearer ${userStore.token}`,
                },
                APIParameters: {
                    client_id: route.params.clientId
                },
                method: 'POST'
            });

            if (HTTPResponseCode.value === 200 && APIResponse.value.checkins) {
                /* checkIns.value = APIResponse.value.checkins; */
                checkIns.value = APIResponse.value.checkins.map(checkin => ({
                    ...checkin, // Spread all properties of the checkin object
                    description: nl2br(checkin.description)
                }));

                console.log(checkIns.value);
            }

        }
    }
    catch (error) {
        console.error('API call failed:', error);
    }
    finally {
        readingClient.value = false;
    }
};

// Form submission handler
const submitForm = async () => {

    postingForm.value = true;

    await APICall({
        endpoint: '/createcheckin',
        headers: {
            Authorization: `Bearer ${userStore.token}`,
        },
        APIParameters: {
            client_id: route.params.clientId,
            description: checkinDescription.value,
            service_ids: selectedServices.value
        },
        method: 'POST'
    });

    if (HTTPResponseCode.value === 200) {
        checkinDescription.value = null;
        selectedServices.value = [];
        toggleForm();
        fetchClientDetails();
    }

    postingForm.value = false;
};

onMounted(() => {
    fetchClientDetails();
});

const showForm = ref(false);
</script>