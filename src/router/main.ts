import { createRouter, createWebHistory } from 'vue-router'
// import { getUserState } from '../firebase'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
    // meta: { requiresUnauth: true }
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ShoppingView.vue')
    // meta: { requiresAuth: true }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('../views/RecipesView.vue'),
    children: [
      {
        path: ':id',
        name: 'recipeDetails',
        component: () =>
          import('../components/core/recipeList/recipeDetails/recipeDetailsComponent.vue')
      }
    ]
    // meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach(async (to, from, next) => {
//   const isAuth = await getUserState()
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
//   const requiresUnauth = to.matched.some((record) => record.meta.unrequiresAuth)

//   if (requiresAuth && !isAuth) next('/')
//   else if (requiresUnauth && isAuth) next('/')
//   else next(to)
// })

export default router
