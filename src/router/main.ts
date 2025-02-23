import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useRecipeStore } from '@/stores/recipe'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shopping-lists',
    name: 'shopping-lists',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ShoppingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('../views/RecipesView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const recipeStore = useRecipeStore()
  // wait a sec to let authorization unfold if needed
  await new Promise(resolve => setTimeout(resolve, 100))

  const userIsAuth = userStore.authorized
  const isTestModeOn = appStore.isTestModeOn
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  
  console.log('Router Guard Details:', {
    path: to.fullPath,
    userIsAuth,
    isTestModeOn,
    requiresAuth
  })

  if (userIsAuth === null) {
    console.log('Auth state still initializing, allowing navigation')
    next()
    return
  }

  if (!isTestModeOn && requiresAuth && !userIsAuth) {
    console.log('Current Path not allowed for user')
    next('/')
    return
  }
  // TODO add recipe ID to url query so no need to reset as each navigation will reset when id not there. 
  recipeStore.setSelectedRecipeId('');
  recipeStore.setEditStatusSelectedId(false);
  next()
})

export default router
