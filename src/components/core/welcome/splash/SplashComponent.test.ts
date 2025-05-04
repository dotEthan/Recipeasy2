import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vitest } from 'vitest'
import { useAppStore } from '@/stores/app'
import SplashComponent from './SplashComponent.vue'

describe('SplashComponent', () => {
  const mountComponent = (initialState = {}) => {
    return mount(SplashComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vitest.fn,
            initialState: {
              app: { testModeOn: false, isAuthModalOpen: false },
              user: { isAuthorized: false },
              ...initialState
            }
          })
        ],
        stubs: {
          AuthComponent: true
        }
      }
    })
  }

  it('renders the welcome title', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.app-title').text()).toBe('Welcome to Recipeasy')
  })

  it('shows test mode button when not authorized and test mode is off', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.testmode-btn').exists()).toBe(true)
  })

  it('hides test mode button when authorized', () => {
    const wrapper = mountComponent({
      user: { authorized: true }
    })
    expect(wrapper.find('.testmode-btn').exists()).toBe(false)
  })

  it('hides test mode button when test mode is on', () => {
    const wrapper = mountComponent({
      app: { testModeOn: true }
    })
    expect(wrapper.find('.testmode-btn').exists()).toBe(false)
  })

  it('toggles test mode when button is clicked', async () => {
    const wrapper = mountComponent()
    const appStore = useAppStore()
    
    await wrapper.find('.testmode-btn').trigger('click')
    expect(appStore.turnTestModeOn).toHaveBeenCalled()
  })

  // it('shows AuthComponent when registration modal is open', () => {
  //   const wrapper = mountComponent({
  //     app: { authModalType: 'registration' }
  //   })
  //   expect(wrapper.findComponent(AuthComponent).exists()).toBe(true)
  // })

  // it('hides AuthComponent when registration modal is closed', () => {
  //   const wrapper = mountComponent({
  //     app: { isAuthModalOpen: false }
  //   })
  //   expect(wrapper.findComponent(AuthComponent).exists()).toBe(false)
  // })

  it('renders photo attribution link', () => {
    const wrapper = mountComponent()
    const link = wrapper.find('.attribute a')
    expect(link.attributes('href')).toBe('https://nick-karvounis.com/')
    expect(link.text()).toContain('Photo by Nick Karvounis on Unsplash')
  })

  describe('Responsive Design', () => {
    it('has correct title font size based on viewport', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.app-title')
      
      expect(getComputedStyle(title.element).fontSize).toBe('2em')
      
      //TODO use window.matchMedia to test Desktop
    })
  })
})