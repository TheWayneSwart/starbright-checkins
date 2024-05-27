import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'
import "@mdi/font/css/materialdesignicons.css"
import "@/assets/styles.css"

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                colors: {
                    primary: '#3c89c1',
                    secondary: '#777777',
                    warning: '#F76800',
                    danger: '#eb4b4b'
                }
            },
            variables: {
                fontFamily: 'Radio Canada Big, sans-serif'
            }
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

loadFonts()

createApp(App)
    .use(router)
    .use(vuetify)
    .use(pinia)
    .mount('#app')
