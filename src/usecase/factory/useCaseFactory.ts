import { newGitHubAccessor, newLocalStorageAccessor } from '@/domain/interface/factory'
import { ApplicationSetting } from '@/domain/model/application'
import { GitHubUrl } from '@/domain/model/github'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase, ApplicationSettingUseCaseFactory } from '@/usecase/applicationSetting'
import { GitHubAccountUseCase, GitHubAccountUseCaseFactory } from '@/usecase/githubAccount'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'
import { AccountSettingUseCaseInteractor } from '@/usecase/interactor/accountSettingUseCaseInteractor'
import { ApplicationSettingUseCaseInteractor } from '@/usecase/interactor/applicationSettingUseCaseInteractor'
import { GitHubAccountUseCaseInteractor } from '@/usecase/interactor/githubAccountUseCaseInteractor'
import { GitHubRepositoryUseCaseInteractor } from '@/usecase/interactor/githubRepositoryUseCaseInteractor'

export class AccountSettingUseCaseFactoryImpl implements AccountSettingUseCaseFactory {
  newAccountSettingUseCase = (setting: ApplicationSetting): AccountSettingUseCase => {
    return new AccountSettingUseCaseInteractor(
      newLocalStorageAccessor(setting.configPostfix)
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
