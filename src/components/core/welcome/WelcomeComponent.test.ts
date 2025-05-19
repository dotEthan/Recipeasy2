
import { ref } from 'vue';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import { useAppStore } from '@/stores/appStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { useUserStore } from '@/stores/userStore';
import WelcomeComponent from './WelcomeComponent.vue';
import { mockRefRecipes } from '@/testing/mockData';
import { createMockedStores } from '@/testing/mockStores';
import { Recipe } from '@/types/Recipes';


describe('WelcomeComponent', () => {
  let wrapper: VueWrapper;
  let recipeStore: ReturnType<typeof useRecipeStore>;
  let appStore: ReturnType<typeof useAppStore>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    const { pinia, recipeStore: mockedRecipeStore, appStore: mockedAppStore, userStore: mockedUserStore } = createMockedStores({
      appStore: {
        screenSize: 'sm',
      },
      recipeStore: {
        selectedRecipeId: '123',
        setSelectedRecipeId: vi.fn(),
      },
    });

    recipeStore = mockedRecipeStore;
    appStore = mockedAppStore;
    userStore = mockedUserStore;

    wrapper = mount(WelcomeComponent, {
      global: {
        plugins: [pinia],
        stubs: {},
      },
      mocks: {
        $expose: {
          recipeDetailsOpen: ref(false),
          closeRecipeDetails: vi.fn(), 
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders the welcome title', async () => {
    expect(wrapper.find('.greeting').text()).toBe('Welcome!');
  });

  // it('renders the welcome title with name if there', async () => {
  //   userStore.localUser.displayName = 'Jim';

  //   await wrapper.vm.$nextTick();

  //   expect(wrapper.find('.greeting').text()).toBe('Welcome, Jim!');
  // });
  
  it('renders the correct meal time based on currentTime', async () => {
    // 8:00 AM
    const currentTime = ref(new Date(2025, 0, 23, 8, 0, 0));
  
    const wrapper = mount(WelcomeComponent, {
      props: {
         currentTime
      },
    });
  
    const mealTimeComponent = wrapper.findComponent({ ref: 'mealtime-collection' });
    const h3Element = mealTimeComponent.find('[data-test="mealtime"]');
  
    expect(h3Element.text()).toBe('Ready for Breakfast:');
  
    // 12:00 PM 
    currentTime.value = new Date(2025, 0, 23, 12, 0, 0);
    
    await wrapper.vm.$nextTick(); 
  
    expect(h3Element.text()).toBe('Ready for Lunch:');
    // 8:00 PM
    currentTime.value = new Date(2025, 0, 23, 20, 0, 0);
    
    await wrapper.vm.$nextTick();

    expect(h3Element.text()).toBe('Ready for Dinner:');
  });
  
  // it('resets values needed when "closeRecipeDetails" is emitted', async () => {

  //   wrapper = shallowMount(WelcomeComponent, {
  //     global: {
  //       stubs: {
  //         RecipeDetailsComponent: {
  //           template: '<div></div>', // Stub child component
  //           emits: ['closeRecipeDetails'],
  //         },
  //       },
  //     },
  //   });
    
  //   const exposed = {
  //     recipeDetailsOpen: ref(false),
  //     closeRecipeDetails: vi.fn(() => {
  //       console.log('closeRecipeDetails mock function called');
  //     }),
  //   };
  //   Object.assign(wrapper.vm, exposed);
    
  //   await wrapper.findComponent(RecipeDetailsComponent).vm.$emit('closeRecipeDetails');
  //   await wrapper.vm.$nextTick();
    
  //   console.log('recipeDetailsOpen.value:', exposed.recipeDetailsOpen.value);
  
  //   recipeStore.selectedRecipeId = '123'; // Mock initial state
  //   exposed.recipeDetailsOpen.value = true; // Now this should work
  //   await wrapper.vm.$nextTick();
  
  //   await wrapper.findComponent(RecipeDetailsComponent).vm.$emit('closeRecipeDetails');
  //   await wrapper.vm.$nextTick();
  
  //   // Assertions
  //   expect(recipeStore.setSelectedRecipeId).toHaveBeenCalledWith('');
  //   expect(exposed.recipeDetailsOpen.value).toBe(false);
  // });

  it('calls generatePublicRecipeCollections and assigns properly', async () => {

    shallowMount(WelcomeComponent, {
      global: {
        provide: {
          recipeStore,
          appStore,
        },
        stubs: {
          RecipeDetailHeaderComponent: true,
          RecipeDetailComponent: true,
        },
      },
    });
    const vm = wrapper.vm as unknown as {
      ethansFavouriteRecipes: Recipe[];
      recommendedRecipes: Recipe[];
      mealTimeRecipes: Recipe[];
      healthyRecipes: Recipe[];
      snackRecipes: Recipe[];
    };
    await wrapper.vm.$nextTick();

    expect(vm.ethansFavouriteRecipes).toEqual([mockRefRecipes.value[0]]);
    expect(vm.recommendedRecipes).toEqual([mockRefRecipes.value[1]]);
    expect(vm.mealTimeRecipes).toEqual([mockRefRecipes.value[2]]);
    expect(vm.healthyRecipes).toEqual([mockRefRecipes.value[4]]);
    expect(vm.snackRecipes).toEqual([mockRefRecipes.value[3]]);
  });
});