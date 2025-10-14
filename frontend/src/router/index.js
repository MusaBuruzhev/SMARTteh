
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/catalog',  
    name: 'Catalog',
    component: CatalogPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router