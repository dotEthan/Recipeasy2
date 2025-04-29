import './assets/main.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/main'
import { useAppStore } from './stores/app'

async function initializeApp() {
  const app = createApp(App);
  app.config.errorHandler = (err, vm, info) => {
    // err: The error object
    // vm: The Vue instance where it occurred
    // info: Vue-specific error info (e.g., 'render function', 'handler')
    console.log('error object: ', err);
    console.log('Vue Instance: ', vm);
    console.log('info : ', info);
  };
  app.use(createPinia());
  app.use(router);
 
  const appStore = useAppStore();

  try {
    await appStore.fetchCsrfToken();
  } catch (error) {
      console.error('csrfToken not fetched');
      // TODO Retry logic?
  } finally {
    app.mount('#app')
  };
}

initializeApp().catch(console.error);
