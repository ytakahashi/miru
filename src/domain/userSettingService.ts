import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { newGitHubAccessor, newLocalStorageAccessor } from '@/domain/interface/factory'
import { GitHubUser } from '@/model/github'

export class UserSettingService {
  private githubApiEndpoint: string
  private githubPersonalAccessToken?: string
  private githubAccessor?: GitHubAccessor
  private localStorageAccessor: LocalStorageAccessor

  constructor (apiEndpoint: string) {
    this.githubApiEndpoint = apiEndpoint
    this.localStorageAccessor = newLocalStorageAccessor()

    const pat = this.localStorageAccessor.getPersonalAccessToken()
    if (pat !== undefined) {
      this.githubPersonalAccessToken = pat
      this.githubAccessor = newGitHubAccessor(apiEndpoint, pat)
    }
  }

  updatePat (pat: string): void {
    this.githubPersonalAccessToken = pat
    this.localStorageAccessor.setPersonalAccessToken(pat)
    this.githubAccessor = newGitHubAccessor(this.githubApiEndpoint, pat)
  }

  getGithubPersonalAccessToken (): string {
    if (this.githubPersonalAccessToken === undefined) {
      throw new Error('pat not provided')
    }
    return this.githubPersonalAccessToken
  }

  async getUser (): Promise<GitHubUser|undefined> {
    const user = this.localStorageAccessor.getUser()
    if (user !== undefined) {
      return user
    }

    const pat = this.githubPersonalAccessToken !== undefined
      ? this.githubPersonalAccessToken
      : this.localStorageAccessor.getPersonalAccessToken()
    if (this.githubAccessor === undefined) {
      if (pat === undefined) {
        return undefined
      }
      this.githubAccessor = newGitHubAccessor(this.githubApiEndpoint, pat)
    }
    return this.githubAccessor.getViewer().then(v => v.viewer)
  }
}
