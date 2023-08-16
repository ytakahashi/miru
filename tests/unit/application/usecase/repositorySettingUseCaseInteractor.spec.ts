/* eslint-disable @typescript-eslint/no-unused-vars */

import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/application/domain/model/application'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  GitHubAccount,
  RepositorySetting as RepositorySettingType,
} from '@/application/infrastructure/dto/local'
import { RepositorySettingUseCaseInteractor } from '@/application/usecase/interactor/repositorySettingUseCaseInteractor'

describe('RepositorySettingUseCaseInteractor', () => {
  describe('addRepositorySetting method', () => {
    it('can add a setting', async () => {
      const accessor = new MockedLocalStorageAccessor()
      const sut = new RepositorySettingUseCaseInteractor(accessor)

      const setting1 = new RepositorySetting('https://github.com/foo/bar')
      const setting2 = new RepositorySetting('https://github.com/foo/baz')

      // add a setting
      const actual = sut.addRepositorySetting(setting1)
      expect(actual).toBe(true)
      const actual2 = sut.getRepositorySettings()
      expect(actual2).toHaveLength(1)

      // add other setting
      const actual3 = sut.addRepositorySetting(setting2)
      expect(actual3).toBe(true)
      const actual4 = sut.getRepositorySettings()
      expect(actual4).toHaveLength(2)
    })

    it('fails when adding duplicated setting', async () => {
      const accessor = new MockedLocalStorageAccessor()
      const sut = new RepositorySettingUseCaseInteractor(accessor)

      const setting1 = new RepositorySetting('https://github.com/foo/bar')

      // add a setting
      const actual = sut.addRepositorySetting(setting1)
      expect(actual).toBe(true)
      expect(sut.getRepositorySettings()).toHaveLength(1)

      // add the same setting
      const actual2 = sut.addRepositorySetting(setting1)
      expect(actual2).toBe(false)
      expect(sut.getRepositorySettings()).toHaveLength(1)
    })

    it('can delete a setting', async () => {
      const accessor = new MockedLocalStorageAccessor()
      const sut = new RepositorySettingUseCaseInteractor(accessor)

      const setting1 = new RepositorySetting('https://github.com/foo/bar')

      // add a setting
      const actual = sut.addRepositorySetting(setting1)
      expect(actual).toBe(true)
      const actual2 = sut.getRepositorySettings()
      expect(actual2).toHaveLength(1)

      // delete the setting
      sut.deleteRepositorySetting(setting1)
      const actual3 = sut.getRepositorySettings()
      expect(actual3).toHaveLength(0)
    })
  })
})

class MockedLocalStorageAccessor implements LocalStorageAccessor {
  settings: RepositorySettingType[] = []

  getPath(): string {
    throw new Error('Method not implemented.')
  }

  setApplicationSettings(settings: ApplicationSetting[]): void {
    throw new Error('Method not implemented.')
  }

  getApplicationSettings(): ApplicationSetting[] {
    throw new Error('Method not implemented.')
  }

  setGitHubAccount(account: GitHubAccount): void {
    throw new Error('Method not implemented.')
  }

  getGitHubAccount(): GitHubAccount | undefined {
    throw new Error('Method not implemented.')
  }

  setRepositorySettings = (settings: RepositorySettingType[]) => {
    this.settings = settings
  }

  getRepositorySettings = (): RepositorySettingType[] => {
    return this.settings
  }
}
