import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { useAppStore } from '@/stores/app';
import { useRecipeStore } from '@/stores/recipe';
import { useUserStore } from '@/stores/user';
import WelcomeComponent from './WelcomeComponent.vue';
import { mockComputedRecipes, mockRefRecipes } from '@/testing/mockData';
import { nextTick } from 'process';
import { reactive, ref } from 'vue';
import { createMockedStores, getMockedRecipeStore } from '@/testing/mockStores';


describe('WelcomeComponent', () => {
  let wrapper: VueWrapper;
  let recipeStore: ReturnType<typeof useRecipeStore>;
  let appStore: ReturnType<typeof useAppStore>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    const { pinia, recipeStore: mockedRecipeStore, appStore: mockedAppStore, userStore: mockedUserStore } = createMockedStores({
      recipeStore: {
        getNRandomPublicRecipes: vi.fn().mockReturnValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
      },
      appStore: {
        screenSize: 'sm',
      },
    });

    recipeStore = mockedRecipeStore;
    appStore = mockedAppStore;
    userStore = mockedUserStore;

    wrapper = mount(WelcomeComponent, {
      global: {
        plugins: [pinia],
        stubs: {
          CollectionComponent: false,
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

  it('renders the welcome title with name if there', async () => {
    userStore.localUser.displayName = 'Jim';

    await nextTick(() => {});

    expect(wrapper.find('.greeting').text()).toBe('Welcome, Jim!');
  });
  
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
  
    console.log('Updated currentTime:', currentTime.value.toLocaleString());
    expect(h3Element.text()).toBe('Ready for Lunch:');
    // 8:00 PM
    currentTime.value = new Date(2025, 0, 23, 20, 0, 0);
    await wrapper.vm.$nextTick();
  
    console.log('Updated currentTime:', currentTime.value.toLocaleString());
    expect(h3Element.text()).toBe('Ready for Dinner:');
  });

  it('calls getNRandomPublicRecipes with the correct number of recipes based on screen size', async () => {
    const { recipeStore, appStore } = createMockedStores({
      recipeStore: {
        getNRandomPublicRecipes: vi.fn(() => ref([])), 
      },
      appStore: {
        screenSize: 'lg',
      },
    });

    shallowMount(WelcomeComponent, {
      global: {
        provide: {
          recipeStore,
          appStore,
        },
      },
    });

    await nextTick(() => {});

    expect(recipeStore.getNRandomPublicRecipes).toHaveBeenCalledWith(5);

    appStore.screenSize = 'sm';
    await nextTick(() => {});

    expect(recipeStore.getNRandomPublicRecipes).toHaveBeenCalledWith(6);
  });
});