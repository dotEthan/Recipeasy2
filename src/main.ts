import './assets/main.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/main'
import { useAppStore } from './stores/app'

async function initializeApp() {
  const app = createApp(App);

  app.use(createPinia());
 
 
  try {
    // TODO Increase timeout and add error handling
 
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
