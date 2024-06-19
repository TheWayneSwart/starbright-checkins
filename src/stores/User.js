import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        currentView: localStorage.getItem('currentView') || 'dashboard', // dashboard is the default view
        token: localStorage.getItem('token'),
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        userEmail: localStorage.getItem('userEmail'),
        userAvatar: localStorage.getItem('userAvatar'),
        userId: localStorage.getItem('userId'),
    }),
    actions: {
        login(loginData) {
            this.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');

            this.token = loginData.token;
            localStorage.setItem('token', loginData.token);

            this.firstName = loginData.firstName;
            localStorage.setItem('firstName', loginData.firstName);

            this.lastName = loginData.lastName;
            localStorage.setItem('lastName', loginData.lastName);

            this.userEmail = loginData.userEmail;
            localStorage.setItem('userEmail', loginData.userEmail);

            this.userAvatar = loginData.userAvatar;
            localStorage.setItem('userAvatar', loginData.userAvatar);

            this.userId = loginData.userId;
            localStorage.setItem('userId', loginData.userId);
        },
        logout() {
            this.isLoggedIn = false;
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('currentView', 'dashboard');

            this.token = null;
            localStorage.removeItem('token');

            this.firstName = null;
            localStorage.removeItem('firstName');

            this.lastName = null;
            localStorage.removeItem('lastName');

            this.userEmail = null;
            localStorage.removeItem('userEmail');

            this.userAvatar = null;
            localStorage.removeItem('userAvatar');

            this.userId = null;
            localStorage.removeItem('userId');
        },
        setView(view) {
            this.currentView = view;
            localStorage.setItem('currentView', view);
        },
    },
});
