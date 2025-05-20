import { vi } from 'vitest';
import { computed, ref } from 'vue';
import { createTestingPinia } from '@pinia/testing';
import { useRecipeStore } from '@/stores/recipeStore';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { mockRefRecipes } from './mockData';
import { RecipeStore } from '@/types/Recipes';

export const getMockedRecipeStore = (overrides: Partial<RecipeStore> = {}) => ({
    userId: ref('1234'),
    recipes: ref([]),
    allTags: ref([]),
    selectedRecipeId: ref('123'),
    publicRecipes: ref([]),
    newPublicRecipes: ref([]),
    usedPublicRecipeIndices: ref([]),
    removedPublicRecipes: ref([]),
    isSelectedRecipePublic: ref(false),
    editSelectedRecipe: ref(false),
    
    personalFilters: computed(() => ['testfilter']),
    recipesLength: computed(() => 1),
    publicRecipesLength: computed(() => 1),
    selectedRecipe: computed(() => mockRefRecipes.value[0]),
    getAllRecipeTags: computed(() => ['tasty']),
    useFilteredRecipes: vi.fn(() => ref([])),
    setInitialRecipeState: vi.fn(),
    generatePublicRecipeCollections: vi.fn(() => [
        ref([mockRefRecipes.value[0]]),
        ref([mockRefRecipes.value[1]]),
        ref([mockRefRecipes.value[2]]),
        ref([mockRefRecipes.value[3]]),
        ref([mockRefRecipes.value[4]]),
      ]),
    updateRecipe: vi.fn(),
    addRecipe: vi.fn(),
    setSelectedRecipeId: vi.fn(),
    setEditStatusSelectedId: vi.fn(),
    removeRecipeById: vi.fn(),
    resetNewPublicRecipes: vi.fn(),
    resetRemovedPublicRecipes: vi.fn(),
    resetState: vi.fn(),

    ...overrides,
});

// TODO Fix Computed properties
export const getMockedAppStore = (overrides: Partial<ReturnType<typeof useAppStore>> = {}) => ({
    
    testModeOn: false,
    screenSize: 'md',
    isMobileMenuOpen: false,
    appHasUnsavedChanges: false,
    showUnsavedChangesModal: false,
    authModalType: '',

    isTestModeOn: vi.fn().mockReturnValue(false),
    isAuthModalOpen: vi.fn().mockReturnValue(false),

    initializeApp: vi.fn(),
    resetAppStates: vi.fn(),
    turnTestModeOn: vi.fn(),
    turnTestModeOff: vi.fn(),
    setAuthModalType: vi.fn(),
    setScreenSize: vi.fn(),
    resetState: vi.fn(),

    ...overrides,
});

// TODO Fix Computed properties
export const getMockedUserStore = (overrides: Partial<ReturnType<typeof useUserStore>> = {}) => ({
    // state
    _id: '',
    authorized: false,
    localUser: { _id: '', displayName: '' },
    personalFilters: [],
    
    // Computed
    isAuthorized: vi.fn().mockReturnValue(false),
    getCurrentUser: vi.fn().mockReturnValue({ _id: '', displayName: '' }),
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
