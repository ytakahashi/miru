import { newGitHubAccessor, newLocalStorageAccessor } from '@/application/domain/interface/factory'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubUrl } from '@/application/domain/model/github'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase, ApplicationSettingUseCaseFactory } from '@/application/usecase/applicationSetting'
import { GitHubAccountUseCase, GitHubAccountUseCaseFactory } from '@/application/usecase/githubAccount'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { RepositorySettingUseCase, RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import { AccountSettingUseCaseInteractor } from '@/application/usecase/interactor/accountSettingUseCaseInteractor'
import { ApplicationSettingUseCaseInteractor } from '@/application/usecase/interactor/applicationSettingUseCaseInteractor'
import { GitHubAccountUseCaseInteractor } from '@/application/usecase/interactor/githubAccountUseCaseInteractor'
import { GitHubRepositoryUseCaseInteractor } from '@/application/usecase/interactor/githubRepositoryUseCaseInteractor'
import { LogUseCaseInteractor } from '@/application/usecase/interactor/LogUseCaseInteractor'
import { RepositorySettingUseCaseInteractor } from '@/application/usecase/interactor/repositorySettingUseCaseInteractor'

export class AccountSettingUseCaseFactoryImpl implements AccountSettingUseCaseFactory {
  newAccountSettingUseCase = (setting: ApplicationSetting): AccountSettingUseCase => {
    return new AccountSettingUseCaseInteractor(
      newLocalStorageAccessor(setting.configPostfix),
      new LogUseCaseInteractor()
    )
  }
}

export class ApplicationSettingUseCaseFactoryImpl implements ApplicationSettingUseCaseFactory {
  newApplicationSettingUseCase = (): ApplicationSettingUseCase => {
    return new ApplicationSettingUseCaseInteractor(newLocalStorageAccessor())
  }
}

export class GitHubRepositoryUseCaseFactoryImpl implements GitHubRepositoryUseCaseFactory {
  newGitHubRepositoryUseCase = (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryUseCase => {
    return new GitHubRepositoryUseCaseInteractor(
      newGitHubAccessor(githubUrl),
      personalAccessToken
    )
  }
}

export class GitHubAccountUseCaseFactoryImpl implements GitHubAccountUseCaseFactory {
  newGitHubAccountUseCase = (githubUrl: GitHubUrl): GitHubAccountUseCase => {
    return new GitHubAccountUseCaseInteractor(githubUrl)
  }
}

export class RepositorySettingUseCaseFactoryImpl implements RepositorySettingUseCaseFactory {
  newRepositorySettingUseCase = (setting: ApplicationSetting): RepositorySettingUseCase => {
    return new RepositorySettingUseCaseInteractor(
      newLocalStorageAccessor(setting.configPostfix)
    )
  }
}
