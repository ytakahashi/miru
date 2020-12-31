import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/issues',
    name: 'GitHubIssues',
    component: () => import(/* webpackChunkName: "issues" */ '../views/GitHubIssues.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
