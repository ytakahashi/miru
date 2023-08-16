import { reactive } from 'vue'
import { CommitHistory } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

const store = reactive<CommitHistory[]>([])

export const getters = {
  of(url: RepositorySetting): CommitHistory | undefined {
    return store.find(s => s.belongsTo(url.getUrl()))
  },
}

export const mutations = {
  add(commitHistories: CommitHistory[]): void {
    store.push(...commitHistories)
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
  replace(commitHistory: CommitHistory): void {
    const url = commitHistory.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(commitHistory)
    store.splice(0)
    store.push(...f)
  },
}
