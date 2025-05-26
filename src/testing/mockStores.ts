import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import { computed, ref } from "vue";

import { useAppStore } from "@/stores/appStore";
import { useErrorStore } from "@/stores/errorStore";
import { useRecipeStore } from "@/stores/recipeStore";
import { useShoppingListStore } from "@/stores/shoppingListStore";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import { mockRefRecipes, mockRefShoppingLists } from "@/testing/mockData";
import { AppStore, ScreenSize } from "@/types/AppState.d";
import type { RecipeStore } from "@/types/Recipes.d";
import type { ShoppingListStore } from "@/types/ShoppingLists.d";
import type { ToastStore } from "@/types/Toasts";
import type { UserStore } from "@/types/UserState.d";
import type { ErrorStore } from "@/types/errors.d";

export const getMockedAppStore = (overrides: Partial<AppStore> = {}) => ({
  authModalType: "",
  screenSize: ScreenSize.MEDIUM,
  isMobileMenuOpen: false,
  appHasUnsavedChanges: false,
  showUnsavedChangesModal: false,
  accessToken: "",
  isLoading: false,
  lightMode: true,

  isAuthModalOpen: computed(() => false),

  setInitialAppState: vi.fn(),
  resetAppStates: vi.fn(),
  setAuthModalType: vi.fn(),
  setScreenSize: vi.fn(),
  setAcessToken: vi.fn(),
  isLoadingToggle: vi.fn(),
  hydrateStore: vi.fn(),
  resetState: vi.fn(),

  ...overrides
});

export const getMockedErrorStore = (overrides: Partial<ErrorStore> = {}) => ({
  errors: "",
  validationErrors: {},
  showErrorModal: false,
  currentModalError: null,

  handleError: vi.fn(),
  handleApiError: vi.fn(),
  addToastError: vi.fn().mockReturnValue(1),
  setValidationErrors: vi.fn(),
  closeErrorModal: vi.fn(),

  // for test-specific customization
  ...overrides
});

export const getMockedRecipeStore = (overrides: Partial<RecipeStore> = {}) => ({
  recipes: ref([]),
  publicRecipes: ref([]),
  allTags: ref([]),
  ethansFavouritePublicIds: ref([]),
  selectedRecipeId: ref(""),
  editSelectedRecipe: ref(false),
  tempRecipeSaveArray: ref([]),
  tempRecipeDeleteArray: ref([]),

  getAllUserRecipes: computed(() => []),
  selectedRecipe: computed(() => mockRefRecipes.value[0]),
  isSelectedRecipePublic: computed(() => true),
  isSelectedRecipeInLocalUsersRecipes: computed(() => true),
  isSelectedRecipeLocalUsers: computed(() => true),
  personalFilters: computed(() => ["testFilter"]),
  recipesLength: computed(() => 1),
  publicRecipesLength: computed(() => 1),
  getAllRecipeTags: computed(() => ["testTag"]),

  useFilteredRecipes: vi.fn().mockReturnValue([]),
  setInitialPublicRecipeState: vi.fn(),
  setInitialUserRecipeState: vi.fn(),
  generatePublicRecipeCollections: vi
    .fn()
    .mockReturnValue([
      ref([mockRefRecipes.value[0]]),
      ref([mockRefRecipes.value[1]]),
      ref([mockRefRecipes.value[2]]),
      ref([mockRefRecipes.value[3]]),
      ref([mockRefRecipes.value[4]])
    ]),
  updatePublicRecipe: vi.fn(),
  getRecipeById: vi.fn().mockReturnValue(mockRefRecipes.value[0]),
  updateRecipe: vi.fn(),
  addRecipe: vi.fn(),
  setSelectedRecipeId: vi.fn(),
  setEditStatusSelectedId: vi.fn(),
  backupNewRecipeDataForSave: vi.fn(),
  prepareRecipeDeletion: vi.fn(),
  finishRecipeDeletion: vi.fn(),
  revertRecipeDeletion: vi.fn(),
  removeRecipeById: vi.fn(),
  prepRecipeDataForUpdate: vi.fn(),
  finishSuccessfulSave: vi.fn(),
  revertFailedSave: vi.fn(),
  finishSuccessfulUpdate: vi.fn(),
  revertFailedUpdate: vi.fn(),
  clearSelectedRecipeId: vi.fn(),
  hydrateStore: vi.fn(),
  resetState: vi.fn(),
  resetUserRecipeState: vi.fn(),

  ...overrides
});

export const getMockedShoppingListStore = (overrides: Partial<ShoppingListStore> = {}) => ({
  shoppingLists: [],
  editingListIndex: -1,
  editingItemIndex: -1,

  defaultList: computed(() => mockRefShoppingLists.value[0]),

  setInitialListState: vi.fn(),
  getItemValue: vi.fn().mockReturnValue("testToast"),
  addNewList: vi.fn(),
  addToDefaultList: vi.fn(),
  deleteList: vi.fn(),
  setDefaultList: vi.fn(),
  setEditingListIndex: vi.fn(),
  setEditingItemIndex: vi.fn(),
  deleteListItem: vi.fn(),
  hydrateStore: vi.fn(),
  resetState: vi.fn(),

  ...overrides
});

export const getMockedToastStore = (overrides: Partial<ToastStore> = {}) => ({
  toastQueue: [],
  activeTimeouts: new Map(),
  startTimes: new Map(),

  showToast: vi.fn(),
  startToastTimer: vi.fn(),
  removeToast: vi.fn(),
  pauseTimer: vi.fn(),
  resumeTimer: vi.fn(),

  ...overrides
});

export const getMockedUserStore = (overrides: Partial<UserStore> = {}) => ({
  authorized: false,
  localUser: { _id: "", displayName: "" },

  isAuthorized: computed(() => false),
  isUserVerified: computed(() => false),
  getCurrentUser: computed(() => ({ _id: "1234" })),
  getCurrentUserId: computed(() => "1234"),
  getCurrentUserEmail: computed(() => "email@email.com"),
  getUserPersonalPreferences: computed(() => ["testFilters"]),

  deauthorize: vi.fn(),
  authorize: vi.fn(),
  setLocalUser: vi.fn(),
  setInitialUserState: vi.fn(),
  verifyUser: vi.fn(),
  addIdToLocalUserRecipes: vi.fn(),
  removeIdFromLocalUserRecipes: vi.fn(),
  hydratestore: vi.fn(),
  resetState: vi.fn(),

  // Allow overrides for test-specific customization
  ...overrides
});

export const createMockedStores = (
  overrides: {
    appStore?: Partial<AppStore>;
    errorStore?: Partial<ErrorStore>;
    recipeStore?: Partial<RecipeStore>;
    shoppingListStore?: Partial<ShoppingListStore>;
    toastStore?: Partial<ToastStore>;
    userStore?: Partial<UserStore>;
  } = {}
) => {
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn
  });

  const appStore = useAppStore(pinia);
  const errorStore = useErrorStore(pinia);
  const recipeStore = useRecipeStore(pinia);
  const shoppingListStore = useShoppingListStore(pinia);
  const toastStore = useToastStore(pinia);
  const userStore = useUserStore(pinia);

  Object.assign(appStore, getMockedAppStore(overrides.appStore));
  Object.assign(errorStore, getMockedErrorStore(overrides.errorStore));
  Object.assign(recipeStore, getMockedRecipeStore(overrides.recipeStore));
  Object.assign(shoppingListStore, getMockedShoppingListStore(overrides.shoppingListStore));
  Object.assign(toastStore, getMockedToastStore(overrides.toastStore));
  Object.assign(userStore, getMockedUserStore(overrides.userStore));

  return { pinia, appStore, errorStore, recipeStore, shoppingListStore, toastStore, userStore };
};
