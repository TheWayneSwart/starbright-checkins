<template> 
    <v-empty-state title="Page not found" icon="mdi-emoticon-sad-outline">

        <template v-slot:media>
            <v-icon color="light-blue-darken-4"></v-icon>
        </template>

        <template v-slot:headline>
            <div class="text-h3 font-weight-bold mt-3">
                404
            </div>
        </template>

        <template v-slot:title>
            <div class="text-h6">
                The page you are trying to access was not found
            </div>
        </template>

        <template v-slot:text>
            <div class="text-medium-emphasis text-caption">
                For more information please contact your administrator.
            </div>
        </template>

    </v-empty-state>
</template>