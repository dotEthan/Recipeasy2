import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
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
  const isAuth = userStore.isAuthorized
  const isTestModeOn = appStore.isTestModeOn
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  // const requiresUnauth = to.matched.some((record) => record.meta.unrequiresAuth)

  console.log('router to: ', to)
  if (!isTestModeOn && requiresAuth && !isAuth) next('/')
  // else if (requiresUnauth && isAuth) next('/')
  next()
})

export default router
