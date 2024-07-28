import { reactive } from 'vue'
import { PullRequests } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'

const store = reactive<Array<PullRequests>>([])

export const getters = {
  of(url: RepositorySetting): PullRequests | undefined {
    return store.find(s => s.belongsTo(url.getUrl()))
  },
}

export const mutations = {
  add(pulls: Array<PullRequests>): void {
    store.push(...pulls)
  },
  clear(): void {
    store.splice(0)
  },
  remove(setting: RepositorySetting): void {
    const url = setting.getUrl()
    const f = store.filter(s => !s.belongsTo(url))
    store.splice(0)
    store.push(...f)
  },
  replace(pulls: PullRequests): void {
    const url = pulls.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(pulls)
    store.splice(0)
    store.push(...f)
  },
}
