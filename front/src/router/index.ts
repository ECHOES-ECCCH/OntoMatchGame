import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'

const Login = () => import('../pages/auth/UserLogin.vue')
const Signup = () => import('@/pages/auth/UserSignUp.vue')
const ResetPassword = () => import('@/pages/auth/UserResetPassword.vue')
const HomePage = () => import('@/pages/HomePage.vue')
const ChallengeGame = () => import('@/pages/ChallengeGame.vue')
const ScenariosList = () => import('@/pages/GameSelection.vue')
const UserStatistics = () => import('@/pages/UserStatistics.vue')
const LeaderBoard = () => import('@/pages/LeaderBoard.vue')
const FreeMode = () => import('@/pages/FreeMode.vue')
const NotFound = () => import('@/pages/NotFound.vue')

import { authStore } from '@/stores/auth.store'
import { useSolution } from '@/composables/useSolution'
const { resetSolution } = useSolution()

// Connexion requise pour accéder aux pages du jeu
const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (!authStore.state.value.isAuthenticated) {
    next('/')
  } else {
    next()
  }
}

// Connexion effectué, retour les les pages d'authentification bloquées
const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (authStore.state.value.isAuthenticated) {
    next('/home')
  } else {
    next()
  }
}

const routes = [
  { path: '/', component: Login, beforeEnter: requireGuest },
  { path: '/signup', component: Signup, beforeEnter: requireGuest },
  { path: '/reset-password', component: ResetPassword, beforeEnter: requireGuest },
  { path: '/home', component: HomePage, beforeEnter: requireAuth },
  { path: '/challenge', component: ChallengeGame, beforeEnter: requireAuth },
  { path: '/game-selection', component: ScenariosList, beforeEnter: requireAuth },
  { path: '/statistics', component: UserStatistics, beforeEnter: requireAuth },
  { path: '/leader-board', component: LeaderBoard, beforeEnter: requireAuth },
  { path: '/free-mode', component: FreeMode, beforeEnter: requireAuth },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Met à jour showSolution au changement de page pour être rediriger vers le bon challenge
router.beforeEach(() => {
  resetSolution()
})

export default router
