import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/userStore'
import { useRecipeStore } from '@/stores/recipeStore'

// TODO Verified and AUthorized user requires
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
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: HomeView,
    props: (route: RouteLocationNormalized) => ({
      token: route.query.token,
      authMode: 'set-password'
    })
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const recipeStore = useRecipeStore()
  // wait a sec to let authorization unfold if needed
  await new Promise(resolve => setTimeout(resolve, 100))

  const userIsAuth = userStore.authorized
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  
  console.log('Router Guard Details:', {
    path: to.fullPath,
    userIsAuth,
    requiresAuth
  })

  if (userIsAuth === null) {
    // TODO why allowing? routing refactor will check
    console.log('Auth state still initializing, allowing navigation')
    next()
    return
  }

  if (requiresAuth && !userIsAuth) {
    console.log('Current Path not allowed for user')
    next('/')
    return
  }
  // TODO add recipe ID to url query so no need to reset as each navigation will reset when id not there. 
  recipeStore.clearSelectedRecipeId();
  recipeStore.setEditStatusSelectedId(false);
  next()
})

export default router
