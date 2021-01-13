import { reactive } from 'vue'
import { Issues } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'

const store = reactive<Array<Issues>>([])

export const getters = {
  of (url: RepositoryUrl): Issues | undefined {
    return store.find(s => s.belongsTo(url))
  }
}

export const mutations = {
  add (issues: Array<Issues>): void {
    store.push(...issues)
  },
  clear (): void {
    store.splice(0)
  },
  replace (issues: Issues): void {
    const url = issues.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(issues)
    store.splice(0)
    store.push(...f)
  }
}
