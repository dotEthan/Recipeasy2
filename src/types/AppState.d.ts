import { ComputedRef, Ref } from "vue";

import { ScreenSize } from "@/constants";

export interface AppStore {
  authModalType: Ref<string>;
  screenSize: Ref<ScreenSize>;
  isMobileMenuOpen: Ref<boolean>;
  appHasUnsavedChanges: Ref<boolean>;
  showUnsavedChangesModal: Ref<boolean>;
  accessToken: Ref<string>;
  isLoading: Ref<boolean>;
  lightMode: Ref<boolean>;

  isAuthModalOpen: ComputedRef<boolean>;
  recipesPerCollection: ComputedRef<number>;

  setInitialAppState(appState: InitialAppState): void;
  toggleLightMode(): void;
  resetAppStates(): void;
  setAuthModalType(type: string): void;
  setScreenSize(updatedScreenSize: ScreenSize): void;
  setAcessToken(token: string): void;
  isLoadingToggle(): void;
  hydrateStore(appState: InitialAppState): void;
  resetState(): void;
}

export type AppState = {
  testModeOn: boolean;
  authModalType: string;
  screenSize: string;
  isMobileMenuOpen: boolean;
  appHasUnsavedChanges: boolean;
  showUnsavedChangesModal: boolean;
  accessToken: string;
  isLoading: boolean;
  lightMode: boolean;
};

export type CachedAppState = {
  testModeOn: boolean;
  authModalType: string;
  isMobileMenuOpen: boolean;
  route: string;
  lightMode: boolean;
  expiresAt: number;
};

export type InitialAppState = Partial<AppState>;
