import { reactive } from 'vue'
import { Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

const store = reactive<Array<Releases>>([])

export const getters = {
  of (url: RepositorySetting): Releases | undefined {
    return store.find(s => s.belongsTo(url.getUrl()))
  }
}

export const mutations = {
  add (releases: Array<Releases>): void {
    store.push(...releases)
  },
  clear (): void {
    store.splice(0)
  },
  remove (setting: RepositorySetting): void {
    const url = setting.getUrl()
    const f = store.filter(s => !s.belongsTo(url))
    store.splice(0)
    store.push(...f)
  },
  replace (releases: Releases): void {
    const url = releases.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(releases)
    store.splice(0)
    store.push(...f)
  }
}
