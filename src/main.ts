import { createPinia } from "pinia";

import { createApp } from "vue";

import App from "@/App.vue";
import { CriticalError } from "@/errors";
import router from "@/router/main";
import { useErrorStore } from "@/stores/errorStore";

import "./assets/main.sass";
import { handleError } from "./utilities/ErrorHandler";

async function initializeApp() {
  const app = createApp(App);
  app.config.errorHandler = (error, vm, info) => {
    const errorStore = useErrorStore();

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error occurred";

    const componentName = vm?.$options?.name || "AnonymousComponent";
    handleError(
      new CriticalError(`Vue Error: ${errorMessage}`, {
        component: componentName,
        info,
        originalError: error
      })
    );
  };

  app.use(createPinia());
  app.use(router);

  app.mount("#app");
}

initializeApp().catch((error) => {
  const errorStore = useErrorStore();
  handleError(new CriticalError("App initialization failed", { originalError: error }));
});
