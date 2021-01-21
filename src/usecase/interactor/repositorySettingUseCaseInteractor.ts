import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { RepositorySettingUseCase } from '@/usecase/repositorySetting'

export class RepositorySettingUseCaseInteractor implements RepositorySettingUseCase {
  #localStorageAccessor: LocalStorageAccessor

  constructor (localStorageAccessor: LocalStorageAccessor) {
    this.#localStorageAccessor = localStorageAccessor
  }

  addRepositorySetting (url: RepositorySetting): void {
    const current = this.#localStorageAccessor.getRepositorySettings()
    const added = {
      url: url.getUrl(),
      showsIssues: url.showsIssues(),
      showsPullRequests: url.showsPullRequests()
    }
    const next = current.length ? new Set([...current, added]) : new Set([added])
    this.#localStorageAccessor.setRepositorySettings(Array.from(next))
  }

  deleteRepositorySetting (url: RepositorySetting): void {
    const current = this.#localStorageAccessor.getRepositorySettings()
    const next = current.filter(r => r.url !== url.getUrl())
    this.#localStorageAccessor.setRepositorySettings(Array.from(next))
  }

  getRepositorySettings (): Array<RepositorySetting> {
    const current = this.#localStorageAccessor.getRepositorySettings()
    return current.map(v => new RepositorySetting(
      v.url,
      {
        showsIssues: v.showsPullRequests,
        showsPullRequests: v.showsPullRequests
      }
    ))
  }

  setRepositorySettings (urls: Array<RepositorySetting>): void {
    const stored = urls.map(url => {
      return {
        url: url.getUrl(),
        showsIssues: url.showsIssues(),
        showsPullRequests: url.showsPullRequests()
      }
    })
    this.#localStorageAccessor.setRepositorySettings(Array.from(stored))
  }
}
