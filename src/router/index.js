import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // suas rotas...
    {
      path: '/migrador-notas',
      name: 'migrador-notas',
      component: () => import('../views/MigradorNotas.vue'),
    },
  ],
})

export default router
