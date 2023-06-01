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
    },
    {
      path: '/scene2',
      name: 'Scene2',
      component: () => import('../views/threejs/scene2/index.vue')
    },
    {
      path: '/scene3',
      name: 'Scene3',
      component: () => import('../views/threejs/scene3/index.vue')
    },
    {
      path: '/scene4',
      name: 'Scene4',
      component: () => import('../views/threejs/scene4/index.vue')
    },
    {
      path: '/scene5',
      name: 'Scene5',
      component: () => import('../views/threejs/scene5/index.vue')
    },
    {
      path: '/scene6',
      name: 'Scene6',
      component: () => import('../views/threejs/scene6/index.vue')
    },
    {
      path: '/scene7',
      name: 'Scene7-gui',
      component: () => import('../views/threejs/scene7/index.vue')
    },
    {
      path: '/scene8',
      name: 'Scene8-几何体',
      component: () => import('../views/threejs/scene8/index.vue')
    }
  ]
})

export default router
