import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { RepositorySettingUseCase } from '@/application/usecase/repositorySetting'

export class RepositorySettingUseCaseInteractor implements RepositorySettingUseCase {
  #localStorageAccessor: LocalStorageAccessor

  constructor (localStorageAccessor: LocalStorageAccessor) {
    this.#localStorageAccessor = localStorageAccessor
  }

  addRepositorySetting (setting: RepositorySetting): boolean {
    const current = this.#localStorageAccessor.getRepositorySettings()
    const included = current.map(v => v.url).includes(setting.getUrl())
    if (included) {
      return false
    }
    const added = {
      url: setting.getUrl(),
      showsIssues: setting.showsIssues(),
      showsPullRequests: setting.showsPullRequests(),
      showsReleases: setting.showsReleases()
    }
    const next = current.length ? new Set([...current, added]) : new Set([added])
    this.#localStorageAccessor.setRepositorySettings(Array.from(next))
    return true
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
        showsIssues: v.showsIssues,
        showsPullRequests: v.showsPullRequests,
        showsReleases: v.showsReleases
      }
    ))
  }

  setRepositorySettings (settings: Array<RepositorySetting>): void {
    const stored = settings.map(setting => {
      return {
        url: setting.getUrl(),
        showsIssues: setting.showsIssues(),
        showsPullRequests: setting.showsPullRequests(),
        showsReleases: setting.showsReleases()
      }
    })
    this.#localStorageAccessor.setRepositorySettings(Array.from(stored))
  }
}
