import { reactive } from 'vue'
import { Issues } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

const store = reactive<Array<Issues>>([])

export const getters = {
  of(url: RepositorySetting): Issues | undefined {
    return store.find(s => s.belongsTo(url.getUrl()))
  },
}

export const mutations = {
  add(issues: Array<Issues>): void {
    store.push(...issues)
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
  replace(issues: Issues): void {
    const url = issues.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(issues)
    store.splice(0)
    store.push(...f)
  },
}
