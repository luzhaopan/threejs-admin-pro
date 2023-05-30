import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/dashboard/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/three',
      name: 'Three',
      component: () => import('../views/threejs/model1/index.vue')
    },
    {
      path: '/scene1',
      name: 'Scene1',
      component: () => import('../views/threejs/scene1/index.vue')
    }
  ]
})

export default router
