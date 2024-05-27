<template>
    <v-layout height="100%" justify-center>
        <v-row class="justify-center align-center">
            <v-col cols="12" lg="4">                
                <v-card class="pa-5 border-b-xl border-primary" elevation="16">
                    <p class="text-h4 font-weight-bold blue-lighten-1 mb-5">Authentication required</p>
                    <p>It seems like you are no longer logged in. Please log in again or contact your administrator for help.</p>
                    <v-btn @click="login" variant="flat" color="primary" class="mt-5" prepend-icon="mdi-login" text="Sign in"></v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-layout>
</template>

<script setup>

const login = () => {
    window.location = `${process.env.VUE_APP_CLIENTSDB_URL}`;
}

</script>