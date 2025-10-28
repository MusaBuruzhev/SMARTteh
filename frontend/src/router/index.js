import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Checkout from '@/pages/Checkout.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ContactsPage from '@/pages/ContactsPage.vue'
import HelpPage from '@/pages/HelpPage.vue'

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
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductDetail
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: ContactsPage
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router