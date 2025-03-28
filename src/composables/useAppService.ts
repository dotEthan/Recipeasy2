import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useShoppingListStore } from '@/stores/shoppingList'
import axios from '@/axios';
import type { ScreenSize } from '@/types/ScreenSize'

//TODO test otehr browsers to see if needed. Firefox already throttles
function debounce(fn: Function, delay: number) {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}

export function useAppService() {
  const appStore = useAppStore()
  const screenWidth = ref(window.innerWidth)

  const updatescreenSize = () => {
    const width = screenWidth.value
    let screenSize: ScreenSize
    console.log('screensizze')
    if (width < 640) {
      screenSize = 'sm'
    } else if (width < 1024) {
      screenSize = 'md'
    } else {
      screenSize = 'lg'
    }
    appStore.setScreenSize(screenSize)
  }
  // TODO longer debounce? 
  const onResize = debounce(() => {
    screenWidth.value = window.innerWidth
    updatescreenSize()
  }, 10)

  const handleUnsavedChanges = (e: BeforeUnloadEvent) => {
    const appStore = useAppStore()
    if (appStore.appHasUnsavedChanges) {
      appStore.showUnsavedChangesModal = true
      e.preventDefault()
      
    }
  } 

  const fetchCsrfToken = async (): Promise<string | null> => {
    try {
      const response = await axios.get('/csrf-token', { 
        withCredentials: true 
      });
      console.log('featching response: ', response)
      return response.data.csrfToken;
    } catch (error: unknown) {
      console.error('Failed to fetch CSRF token', error);
      return null;
    }
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { onResize, handleUnsavedChanges, fetchCsrfToken }
}
