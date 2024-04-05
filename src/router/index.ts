import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryDetailsView from '@/views/CategoryDetailsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AddCategory from '@/views/AddCategory.vue'
import AddGenre from '@/views/AddGenre.vue'
import ArticleCreateView from '@/views/ArticleCreateView.vue'
import StoreDetaleView from '@/views/StoreDetaileView.vue'
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
      name: 'categoryDetails',
      props: true,
      component: CategoryDetailsView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/addcategory',
      name: 'addcategory',
      component: AddCategory
    },
    {
      path: '/addgenre',
      name: 'addgenre',
      component: AddGenre
    },
    {
      path: '/articlecreate',
      name: 'articlecreate',
      component: ArticleCreateView
    },
    {
      path: '/store/:storeId/detail',
      name: 'storedetail',
      props: true,
      component: StoreDetaleView
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
