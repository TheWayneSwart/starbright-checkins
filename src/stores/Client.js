import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', {
    state: () => ({
        clientId: localStorage.getItem('activeClientId'),
    }),
    actions: {
        setClientId(clientId) {
            this.clientId = clientId;
            localStorage.setItem('activeClientId', clientId);
        },
    },
});