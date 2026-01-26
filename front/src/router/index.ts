import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/auth/UserLogin.vue'
import Signup from '@/pages/auth/UserSignUp.vue'
import ResetPassword from '@/pages/auth/UserResetPassword.vue'
import HomePage from '@/pages/HomePage.vue'
import LastChallenge from '@/pages/LastChallenge.vue'
import ScenariosList from '@/pages/ScenariosList.vue'
import UserStatistics from '@/pages/UserStatistics.vue'
import UsersRanking from '@/pages/UsersRanking.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: Signup },
  { path: '/reset-password', component: ResetPassword },
  { path: '/home', component: HomePage },
  { path: '/challenge', component: LastChallenge },
  { path: '/scenario', component: ScenariosList },
  { path: '/statistics', component: UserStatistics },
  { path: '/ranking', component: UsersRanking },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
