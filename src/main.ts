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
 
 
  try {
    // TODO Increase timeout
 
    app.use(router);
    const appStore = useAppStore();
    
    await appStore.fetchCsrfToken().then(() => {
      app.mount('#app');
    })
    .catch((error) => {
      app.mount('#app');
      console.error('csrfToken not fetched');
      // TODO Global Error handling with 2-3x retry. 
    });

  } catch (error) {

    console.error('App Initialization Failed', error);
    // TODO Fallback strategy: mount anyway (add better)
    app.use(router);
    app.mount('#app');

  }
}

initializeApp().catch(console.error);
