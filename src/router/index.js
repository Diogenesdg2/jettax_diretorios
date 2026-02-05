// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },

    {
      path: '/migrador-notas',
      name: 'migrador-notas',
      component: () => import('../views/MigradorNotas.vue'),
    },

    // opcional: 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
