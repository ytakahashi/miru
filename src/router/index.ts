import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AccountSettingUseCaseFactoryImpl, ApplicationSettingUseCaseFactoryImpl, GitHubAccountUseCaseFactoryImpl } from '@/usecase/factory/useCaseFactory'
import SettingView from '../views/SettingView.vue'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const applicationSettingUseCase = new ApplicationSettingUseCaseFactoryImpl().newApplicationSettingUseCase()
const gitHubAccountUseCaseFactory = new GitHubAccountUseCaseFactoryImpl()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Setting',
    component: SettingView,
    props: {
      accountSettingUseCaseFactory: accountSettingUseCaseFactory,
      applicationSettingUseCase: applicationSettingUseCase,
      gitHubAccountUseCaseFactory: gitHubAccountUseCaseFactory
    }
  },
  {
    path: '/issues',
    name: 'Issues',
    component: () => import(/* webpackChunkName: "issues" */ '../views/IssuesView.vue'),
    props: {
      accountSettingUseCaseFactory: accountSettingUseCaseFactory,
      applicationSettingUseCase: applicationSettingUseCase
    }
  },
  {
    path: '/pulls',
    name: 'PullRequests',
    component: () => import(/* webpackChunkName: "pulls" */ '../views/PullRequestsView.vue'),
    props: {
      accountSettingUseCaseFactory: accountSettingUseCaseFactory,
      applicationSettingUseCase: applicationSettingUseCase
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
