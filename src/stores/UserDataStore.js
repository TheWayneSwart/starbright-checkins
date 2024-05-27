import { defineStore } from "pinia";
import { ref, watch } from 'vue';
import CryptoJS from 'crypto-js';

export const useUserData = defineStore('userData', () => {
    const loggedIn = ref(localStorage.getItem('loggedIn') === 'true');
    const token = ref(localStorage.getItem('token'));
    const firstName = ref(localStorage.getItem('firstName'));
    const lastName = ref(localStorage.getItem('lastName'));
    const userEmail = ref(localStorage.getItem('userEmail'));
    const userAvatar = ref(localStorage.getItem('userAvatar'));
    const userId = ref(localStorage.getItem('userId'));

    // Method to set user data
    const setUserData = (userData) => {
        loggedIn.value = true;
        token.value = userData.token;
        firstName.value = userData.firstName;
        lastName.value = userData.lastName;
        userEmail.value = userData.userEmail;
        userAvatar.value = userData.userAvatar;
        userId.value = userData.userId;
    };

    // Method to clear user data (logout)
    const clearUserData = () => {
        loggedIn.value = false;
        token.value = null;
        firstName.value = null;
        lastName.value = null;
        userEmail.value = null;
        userAvatar.value = null;
        userId.value = null;
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userId');
    };

    watch(loggedIn, (newValue) => {
        localStorage.setItem('loggedIn', newValue ? 'true' : 'false');
    });
    watch(token, (newValue) => {
        if (newValue) {
            localStorage.setItem('token', newValue);
        } else {
            localStorage.removeItem('token');
        }
    });
    watch(firstName, (newValue) => {
        if (newValue) {
            localStorage.setItem('firstName', newValue);
        } else {
            localStorage.removeItem('firstName');
        }
    });
    watch(lastName, (newValue) => {
        if (newValue) {
            localStorage.setItem('lastName', newValue);
        } else {
            localStorage.removeItem('lastName');
        }
    });
    watch(userEmail, (newValue) => {
        if (newValue) {
            localStorage.setItem('userEmail', newValue);
        } else {
            localStorage.removeItem('userEmail');
        }
    });
    watch(userAvatar, (newValue) => {
        if (newValue) {
            localStorage.setItem('userAvatar', newValue);
        } else {
            localStorage.removeItem('userAvatar');
        }
    });
    watch(userId, (newValue) => {
        if (newValue) {
            localStorage.setItem('userId', newValue);
        } else {
            localStorage.removeItem('userId');
        }
    });


    return { loggedIn, token, firstName, lastName, userId, userEmail, userAvatar, setUserData, clearUserData };
});