<template>
    <v-app>
        <v-main>
            <Navbar v-if="isLoggedIn" @navigate="setView" />

            <!-- Check if the current route is not the auth route -->
            <div v-if="isLoggedIn && !isAuthRoute">
                <component :is="currentComponent" />
            </div>

            <NotloggedIn v-else-if="!isLoggedIn && !isAuthRoute" />

            <!-- AuthComponent will handle its own rendering -->
            <router-view v-if="isAuthRoute"></router-view>
        </v-main>
    </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/User';
import Navbar from '@/components/NavbarComponent';
import DashboardView from '@/views/DashboardView';
import DetailedView from '@/views/DetailedView';
import NotloggedIn from '@/components/NotLoggedInComponent';

const userStore = useUserStore();
const route = useRoute();

const isLoggedIn = computed(() => userStore.isLoggedIn);
const currentView = computed(() => userStore.currentView);
const isAuthRoute = computed(() => route.name === 'Auth');

const components = {
    dashboard: DashboardView,
    details: DetailedView
};

const currentComponent = computed(() => components[currentView.value]);

const setView = (view) => {
    userStore.setView(view);
};
</script>