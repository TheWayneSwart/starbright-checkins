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
                    primary: '#3fccff',
                    secondary: '#c4c4c4',
                    warning: '#F76800',
                    danger: '#ff5e5e'
                }
            },            
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
