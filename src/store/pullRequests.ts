import { reactive } from 'vue'
import { PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'

const store = reactive<Array<PullRequests>>([])

export const getters = {
  of (url: RepositoryUrl): PullRequests | undefined {
    return store.find(s => s.belongsTo(url.getUrl()))
  }
}

export const mutations = {
  add (pulls: Array<PullRequests>): void {
    store.push(...pulls)
  },
  clear (): void {
    store.splice(0)
  },
  replace (pulls: PullRequests): void {
    const url = pulls.repositoryUrl
    const f = store.filter(s => !s.belongsTo(url))
    f.push(pulls)
    store.splice(0)
    store.push(...f)
  }
}
