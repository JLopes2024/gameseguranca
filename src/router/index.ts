import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import ReportView from '../views/ReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
    },
    {
      path: '/relatorio',
      name: 'relatorio',
      component: ReportView,
    },
  ],
})

export default router