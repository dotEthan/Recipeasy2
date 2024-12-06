import './assets/main.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/main'
import { useAuthService } from './composables/useAuthService'

async function initializeApp() {
  const app = createApp(App)
  app.use(createPinia())
 
  const {initializeAuth} = useAuthService()
 
  try {
    // Increase timeout and add error handling
    await Promise.race([
      initializeAuth(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth init timeout')), 8000)
      )
    ])
 
    app.use(router)
    app.mount('#app')
  } catch (error) {
    console.error('App Initialization Failed', error)
    // Fallback strategy: mount anyway
    app.use(router)
    app.mount('#app')
  }
}

initializeApp().catch(console.error)
