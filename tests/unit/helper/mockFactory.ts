import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import {
  AccountSettingUseCase,
  AccountSettingUseCaseFactory,
} from '@/application/usecase/accountSetting'
import {
  GitHubAccountUseCase,
  GitHubAccountUseCaseFactory,
} from '@/application/usecase/githubAccount'

import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import {
  RepositorySettingUseCase,
  RepositorySettingUseCaseFactory,
} from '@/application/usecase/repositorySetting'
import { vi } from 'vitest'

const defaultGithubUrl = new GitHubUrl('https://github.com', 'https://api.github.com/graphql')
export const defaultAccount = new Account(
  'name',
  'https://github.com/profile',
  'avatar',
  defaultGithubUrl,
  'pat'
)

export const createMockAccountSettingUseCase = (
  overrides: Partial<AccountSettingUseCase> = {}
): AccountSettingUseCase => {
  return {
    setAccount: vi.fn(),
    getAccount: vi.fn().mockReturnValue(defaultAccount),
    deleteSetting: vi.fn(),
    ...overrides,
  }
}

export const createMockAccountSettingUseCaseFactory = (
  mockUseCase: AccountSettingUseCase = createMockAccountSettingUseCase()
): AccountSettingUseCaseFactory => {
  return {
    newAccountSettingUseCase: (_setting: ApplicationSetting) => mockUseCase,
  }
}

export const createMockGitHubAccountUseCase = (
  overrides: Partial<GitHubAccountUseCase> = {}
): GitHubAccountUseCase => {
  return {
    resolvePersonalAccessToken: vi.fn().mockResolvedValue(defaultAccount),
    ...overrides,
  }
}

export const createMockGitHubAccountUseCaseFactory = (
  mockUseCase: GitHubAccountUseCase = createMockGitHubAccountUseCase()
): GitHubAccountUseCaseFactory => {
  return {
    newGitHubAccountUseCase: (_githubUrl: GitHubUrl) => mockUseCase,
  }
}

export const createMockApplicationSettingUseCase = (
  settings: Array<ApplicationSetting> = [],
  overrides: Partial<ApplicationSettingUseCase> = {}
): ApplicationSettingUseCase => {
  return {
    hasSetting: (setting: ApplicationSetting) => settings.some(s => s.equals(setting)),
    getSettings: () => settings,
    addSetting: vi.fn(),
    removeSetting: vi.fn(),
    ...overrides,
  }
}

export const createMockRepositorySettingUseCase = (
  repositorySettings: Array<RepositorySetting> = [],
  overrides: Partial<RepositorySettingUseCase> = {}
): RepositorySettingUseCase => {
  return {
    addRepositorySetting: vi.fn(),
    deleteRepositorySetting: vi.fn(),
    getRepositorySettings: () => repositorySettings,
    setRepositorySettings: vi.fn(),
    ...overrides,
  }
}

export const createMockRepositorySettingUseCaseFactory = (
  mockUseCase: RepositorySettingUseCase = createMockRepositorySettingUseCase()
): RepositorySettingUseCaseFactory => {
  return {
    newRepositorySettingUseCase: (_setting: ApplicationSetting) => mockUseCase,
  }
}
