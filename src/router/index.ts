import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import SettingView from '../views/SettingView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Setting',
    component: SettingView
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
