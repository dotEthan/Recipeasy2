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
}

export type CachedAppState = {
  testModeOn: boolean;
  authModalType: string;
  isMobileMenuOpen: boolean;
  route: string;
  lightMode: boolean;
  expiresAt: number;
}

export type InitialAppState = Partial<AppState>;