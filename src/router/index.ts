import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryDetailsView from '@/views/CategoryDetailsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AddCategory from '@/views/AddCategory.vue'
import ArticleCreateView from '@/views/ArticleCreateView.vue'
import StoreDetaleView from '@/views/StoreDetaileView.vue'

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
      path: '/articlecreate',
      name: 'articlecreate',
      component: ArticleCreateView
    },
    {
      path: '/store/:storeId/detail',
      name: 'storedetail',
      props: true,
      component: StoreDetaleView
    }
  ]
})

export default router
