import { vi } from 'vitest';
import { ref } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { useRecipeStore } from '@/stores/recipe';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { mockRefRecipes } from './mockData';
import { RecipeStore } from '@/types/Recipes';

export const getMockedRecipeStore = (overrides: Partial<RecipeStore> = {}) => ({
    userId: ref('1234'),
    recipes: ref([]),
    allTags: ref([]),
    selectedRecipeId: ref('123'),
    existingPublicRecipes: ref([]),
    newPublicRecipes: ref([]),
    usedPublicRecipeIndices: ref([]),
    removedPublicRecipes: ref([]),
    isSelectedRecipePublic: ref(false),
    editSelectedRecipe: ref(false),
    
    personalFilters: vi.fn().mockReturnValue(ref([])),
    recipesLength: vi.fn(() => ref(0)),
    existingPublicRecipesLength: vi.fn(() => ref(0)),
    getSelectedRecipe: vi.fn(() => ref([])),
    getAllRecipeTags: vi.fn(() => ref([])),

    useFilteredRecipes: vi.fn(() => ref([])),
    setInitialRecipeState: vi.fn(),
    getNRandomPublicRecipes: vi.fn((num) => ref(mockRefRecipes.value.slice(0, num))),
    updateRecipe: vi.fn(),
    addRecipe: vi.fn(),
    setSelectedRecipeId: vi.fn(),
    setEditStatusSelectedId: vi.fn(),
    removeRecipeById: vi.fn(),
    addToPublicRecipes: vi.fn(),
    removeFromPublicRecipes: vi.fn(),
    resetNewPublicRecipes: vi.fn(),
    resetRemovedPublicRecipes: vi.fn(),
    resetUsedPublicIndices: vi.fn(),
    resetState: vi.fn(),

    ...overrides,
});

export const getMockedAppStore = (overrides: Partial<ReturnType<typeof useAppStore>> = {}) => ({
    
    testModeOn: false,
    screenSize: 'md',
    isMobileMenuOpen: false,
    appHasUnsavedChanges: false,
    showUnsavedChangesModal: false,
    registrationOrSigninModal: '',

    isTestModeOn: vi.fn().mockReturnValue(false),
    isRegistrationModalOpen: vi.fn().mockReturnValue(false),

    initializeApp: vi.fn(),
    resetAppStates: vi.fn(),
    turnTestModeOn: vi.fn(),
    turnTestModeOff: vi.fn(),
    toggleRegistrationModal: vi.fn(),
    setScreenSize: vi.fn(),
    resetState: vi.fn(),

    ...overrides,
});

export const getMockedUserStore = (overrides: Partial<ReturnType<typeof useUserStore>> = {}) => ({
    // state
    uid: '',
    authorized: false,
    localUser: { uid: '', displayName: '' },
    personalFilters: [],
    
    // Computed
    isAuthorized: vi.fn().mockReturnValue(false),
    getCurrentUser: vi.fn().mockReturnValue({ uid: '', displayName: '' }),
    getCurrentUserId: vi.fn().mockReturnValue(''),
  
    // functions
    deauthorize: vi.fn(),
    authorize: vi.fn(),
    setLocalUser: vi.fn(),
    setInitialUserState: vi.fn(),
    resetState: vi.fn(),
  
    // Allow overrides for test-specific customization
    ...overrides,
});

export const createMockedStores = (overrides: {
    recipeStore?: Partial<ReturnType<typeof useRecipeStore>>;
    appStore?: Partial<ReturnType<typeof useAppStore>>;
    userStore?: Partial<ReturnType<typeof useUserStore>>;
} = {}) => {
    const pinia = createTestingPinia({
        stubActions: false,
        createSpy: vi.fn,
    });

    const recipeStore = useRecipeStore(pinia);
    const appStore = useAppStore(pinia);
    const userStore = useUserStore(pinia);

    Object.assign(recipeStore, getMockedRecipeStore(overrides.recipeStore as Partial<RecipeStore>));
    Object.assign(appStore, getMockedAppStore(overrides.appStore));
    Object.assign(userStore, getMockedUserStore(overrides.userStore));

    return { pinia, recipeStore, appStore, userStore };
};
