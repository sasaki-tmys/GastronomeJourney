import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      // https://vuetifyjs.com/en/styles/colors/#material-colors
      light: {
        dark: false,
        colors: {
          background: '#E1F5FE',
          primary: '#FAFAFA',
          'primary-darken-1': '#EC407A',
          secondary: '#E1F5FE',
          'secondary-darken-1': '#EEEEEE',
          error: '#FF5252',
          info: '#2196F3',
          warning: '#FB8C00',
          accent: '#FF8F00'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#263238',
          primary: '#FAFAFA',
          'primary-darken-1': '#EC407A',
          secondary: '#263238',
          'secondary-darken-1': '#424242',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          accent: '#FF8F00'
        }
      }
    }
  },
  components,
  directives
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
