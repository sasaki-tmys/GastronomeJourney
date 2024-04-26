import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryDetailView from '@/views/CategoryDetailView.vue'
import SettingsView from '@/views/SettingsView.vue'
import CategoryFrom from '@/views/CategoryForm.vue'
import AddGenre from '@/views/AddGenre.vue'
import StoreForm from '@/views/StoreForm.vue'
import StoreDetaleView from '@/views/StoreDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import SginupForm from '@/components/LoginView/SginupForm.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/category/:categoryId',
      name: 'categoryDetail',
      props: true,
      component: CategoryDetailView
    },
    {
      path: '/category/:categoryId/store/:storeId/',
      name: 'storedetail',
      props: true,
      component: StoreDetaleView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/addcategory',
      name: 'addcategory',
      props: true,
      component: CategoryFrom
    },
    {
      path: '/editcategory/:categoryId',
      name: 'editcategory',
      props: true,
      component: CategoryFrom
    },
    {
      path: '/addgenre',
      name: 'addgenre',
      component: AddGenre
    },
    {
      path: '/addstore',
      name: 'addstore',
      component: StoreForm
    },
    {
      path: '/editstore/:storeId',
      name: 'editstore',
      props: true,
      component: StoreForm
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/sginup',
      name: 'Sginup',
      component: SginupForm
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true'
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  authStore.setIsLoggedIn(isLoggedIn)
  authStore.setUser(user)

  next()
})

export default router
