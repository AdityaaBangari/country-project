import { createRouter, createWebHistory } from 'vue-router'
import countryCard from './components/countryCard.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: countryCard
    },
    {
      path: '/:country',
      name: 'country',
      component: () => import('./components/countryDetail.vue')
    }

  ]
})


export default router;