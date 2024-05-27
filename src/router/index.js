import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView'
import DetailedView from '@/views/DetailedView'
import AuthComponent from '@/components/AuthComponent'
import { useUserData } from '@/stores/UserDataStore'
import notLoggedIn from '@/views/notLoggedInView'
import ForOhFour from '@/views/ForOhFour'

const routes = [
    {
        path: '/:catchAll(.*)',
        name: 'defaultCatAllRoute',
        component: ForOhFour
    },
    {
        path: '/',
        name: 'home',
        component: DashboardView,
        meta: { requiresAuth: true },
    },
    {
        path: '/details/:clientId',
        name: 'details',
        component: DetailedView,
        meta: { requiresAuth: true },
    },
    {
        path: '/auth/:token',
        name: 'Auth',
        component: AuthComponent
    },
    {
        path: '/notloggedin',
        name: 'notloggedIn',
        component: notLoggedIn
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


// Navigation guard to check for logged-in status
router.beforeEach((to, from, next) => {
    const userStore = useUserData();

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (userStore.loggedIn) {
            next();
        } else {
            next('/notloggedin');
        }
    } else {
        next();
    }
});

export default router