<template>
    <v-app-bar :elevation="16" v-if="userStore.loggedIn">
        <v-app-bar-title><a href="/">Checkins Dashboard</a></v-app-bar-title>
        <v-spacer></v-spacer>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="me-3">
                    <v-avatar size="x-small">
                        <v-img :src="userStore.userAvatar" class="me-3"></v-img>
                    </v-avatar>
                    {{ userStore.firstName + ' ' + userStore.lastName }}
                </v-btn>
            </template>
            <v-list class="mt-5">
                <v-list-item class="pa-1">

                    <v-dialog max-width="500">                        
                        <template v-slot:activator="{ props: activatorProps }">                            
                            <v-btn width="100%" v-bind="activatorProps" variant="flat" text="Sign out"
                                prepend-icon="mdi-logout"></v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <v-card>
                                <v-progress-linear v-if="loading" color="blue-lighten-1" indeterminate></v-progress-linear>
                                <v-card-title>Confirm</v-card-title>
                                <v-card-text>                                    
                                    Are you sure you wish to sign out?
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn text="Confirm" color="primary" @click="logout"></v-btn>
                                    <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                                </v-card-actions>                                
                            </v-card>
                        </template>
                    </v-dialog>

                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script setup>

import { useUserData } from '@/stores/UserDataStore'
import { useRouter } from 'vue-router'
import useAPICall from '@/composables/useAPICall'

const router = useRouter();
const { APIResponse, HTTPResponseCode, APICall, loading, error } = useAPICall();
const userStore = useUserData();

const logout = async () => {

    await APICall({
        endpoint: '/signout',
        headers: {
            Authorization: `Bearer ${userStore.token}`,
        },
        method: 'GET'
    });

    if (HTTPResponseCode.value === 204) {
        userStore.clearUserData();        
    }
    else {
        console.error(error);
    }

    router.push({ name: 'notloggedIn' });
}

</script>