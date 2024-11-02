import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useShoppingListStore } from '@/stores/shoppingList'
import type { ScreenSize } from '@/types/ScreenSize'

//TODO test otehr browsers to see if needed. Firefox already throttles
function debounce(fn: Function, delay: number) {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}

export function useWindowResize() {
  const appStore = useAppStore()
  const shoppingListStore = useShoppingListStore()
  const screenWidth = ref(window.innerWidth)

  const updatescreenSize = () => {
    const width = screenWidth.value
    let screenSize: ScreenSize
    if (width < 640) {
      screenSize = 'sm'
    } else if (width < 1024) {
      screenSize = 'md'
    } else {
      screenSize = 'lg'
    }
    console.log(screenSize)
    appStore.setScreenSize(screenSize)
    // shoppingListStore.updateWantedViewableLength(screenSize)
  }

  const onResize = debounce(() => {
    screenWidth.value = window.innerWidth
    updatescreenSize()
  }, 10)

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { screenWidth }
}
