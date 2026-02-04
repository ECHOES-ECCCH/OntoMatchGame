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
const LastChallenge = () => import('@/pages/LastChallenge.vue')
const ScenariosList = () => import('@/pages/GameSelection.vue')
const UserStatistics = () => import('@/pages/UserStatistics.vue')
const UsersRanking = () => import('@/pages/UsersRanking.vue')
const FreeMode = () => import('@/pages/FreeMode.vue')

import { authStore } from '@/stores/auth.store'

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
  { path: '/challenge', component: LastChallenge, beforeEnter: requireAuth },
  { path: '/game-selection', component: ScenariosList, beforeEnter: requireAuth },
  { path: '/statistics', component: UserStatistics, beforeEnter: requireAuth },
  { path: '/ranking', component: UsersRanking, beforeEnter: requireAuth },
  { path: '/free-mode', component: FreeMode, beforeEnter: requireAuth },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
