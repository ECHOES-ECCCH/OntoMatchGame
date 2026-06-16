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

// ----------------------------------------------------
// Route Guards
// ----------------------------------------------------

/**
 * Protect authenticated routes
 * Redirects unauthenticated users to login page
 */
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

/**
 * Prevent authenticated users from accessing auth pages
 * Redirects logged-in users to home page
 */
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

// ----------------------------------------------------
// Route definitions
// ----------------------------------------------------
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

// ----------------------------------------------------
// Router instance
// ----------------------------------------------------
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global navigation guard
 * Resets "solution mode" state on every route change
 * Ensures challenge state consistency between pages
 */
router.beforeEach(() => {
  resetSolution()
})

export default router
