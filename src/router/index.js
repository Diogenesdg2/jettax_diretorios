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
      path: '/curriculos',
      name: 'curriculos',
      component: () => import('../views/Curriculos.vue'), // ajuste o nome do arquivo se estiver diferente
    },

    {
      path: '/migrador-notas',
      name: 'migrador-notas',
      component: () => import('../views/MigradorNotas.vue'),
    },

    {
      path: '/privacidade',
      name: 'privacidade',
      component: () => import('../views/Privacidade.vue'),
    },

    // opcional: 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
