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
    name: 'Issues',
    component: () => import(/* webpackChunkName: "issues" */ '../views/IssuesView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
