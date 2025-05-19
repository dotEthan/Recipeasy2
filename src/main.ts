import './assets/main.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/main'
import { useErrorStore } from './stores/errorStore'
import { CriticalError } from './errors'

async function initializeApp() {
  const app = createApp(App);
  app.config.errorHandler = (error, vm, info) => {
    const errorStore = useErrorStore();

    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string'
      ? error
      : 'Unknown error occurred';
      
    const componentName = vm?.$options?.name || 'AnonymousComponent';
    errorStore.handleError(new CriticalError(
      `Vue Error: ${errorMessage}`, 
      { component: componentName, info, originalError: error }
    ));
  };
 
  app.use(createPinia());
  app.use(router);
 
  app.mount('#app');
}

initializeApp().catch((error) => {
  const errorStore = useErrorStore();
  errorStore.handleError(new CriticalError(
    'App initialization failed',
    { originalError: error }
  ));
});
