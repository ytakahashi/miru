import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AccountSettingUseCaseFactoryImpl, ApplicationSettingUseCaseFactoryImpl, RepositorySettingUseCaseFactoryImpl } from '@/usecase/factory/useCaseFactory'
import SettingView from '../views/SettingView.vue'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const applicationSettingUseCase = new ApplicationSettingUseCaseFactoryImpl().newApplicationSettingUseCase()
const repositorySettingUseCaseFactory = new RepositorySettingUseCaseFactoryImpl()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Setting',
    component: SettingView
  },
  {
    path: '/issues',
    name: 'Issues',
    component: () => import(/* webpackChunkName: "issues" */ '../views/IssuesView.vue'),
    props: {
      accountSettingUseCaseFactory: accountSettingUseCaseFactory,
      applicationSettingUseCase: applicationSettingUseCase,
      repositorySettingUseCaseFactory: repositorySettingUseCaseFactory
    }
  },
  {
    path: '/pulls',
    name: 'PullRequests',
    component: () => import(/* webpackChunkName: "pulls" */ '../views/PullRequestsView.vue'),
    props: {
      accountSettingUseCaseFactory: accountSettingUseCaseFactory,
      applicationSettingUseCase: applicationSettingUseCase,
      repositorySettingUseCaseFactory: repositorySettingUseCaseFactory
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
