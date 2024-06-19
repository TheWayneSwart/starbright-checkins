// router.js or routes.js
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView';
import AuthComponent from '@/components/AuthComponent';
import ForOhFour from '@/views/ForOhFour';
import { useUserStore } from '@/stores/User';

const routes = [
    {
        path: '/:catchAll(.*)',
        name: 'defaultCatAllRoute',
        component: ForOhFour,
    },
    {
        path: '/',
        name: 'home',
        component: DashboardView,
        meta: { requiresAuth: true },
    },
    {
        path: '/auth/:token',
        name: 'Auth',
        component: AuthComponent,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation guard to check for logged-in status
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (userStore.isLoggedIn) {
            next();
        }
    } else {
        next();
    }
});

export default router;
