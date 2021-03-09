import { newGitHubAccessor, newLocalStorageAccessor } from '@/application/domain/interface/factory'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubUrl } from '@/application/domain/model/github'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase, ApplicationSettingUseCaseFactory } from '@/application/usecase/applicationSetting'
import { GitHubAccountUseCase, GitHubAccountUseCaseFactory } from '@/application/usecase/githubAccount'
import {
  GetIssuesUseCase,
  GetIssuesUseCaseFactory,
  GetPullRequestsUseCase,
  GetPullRequestsUseCaseFactory,
  GetReleasesUseCase,
  GetReleasesUseCaseFactory
} from '@/application/usecase/githubRepository'
import { RepositorySettingUseCase, RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import { AccountSettingUseCaseInteractor } from '@/application/usecase/interactor/accountSettingUseCaseInteractor'
import { ApplicationSettingUseCaseInteractor } from '@/application/usecase/interactor/applicationSettingUseCaseInteractor'
import { GitHubAccountUseCaseInteractor } from '@/application/usecase/interactor/githubAccountUseCaseInteractor'
import {
  GetIssuesUseCaseInteractor,
  GetPullRequestsUseCaseInteractor,
  GetReleasesUseCaseInteractor
} from '@/application/usecase/interactor/githubRepositoryUseCaseInteractor'
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

export class GetIssuesUseCaseFactoryImpl implements GetIssuesUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetIssuesUseCase => {
    return new GetIssuesUseCaseInteractor(
      newGitHubAccessor(githubUrl),
      personalAccessToken
    )
  }
}

export class GetPullRequestsUseCaseFactoryImpl implements GetPullRequestsUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetPullRequestsUseCase => {
    return new GetPullRequestsUseCaseInteractor(
      newGitHubAccessor(githubUrl),
      personalAccessToken
    )
  }
}

export class GetReleasesUseCaseFactoryImpl implements GetReleasesUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetReleasesUseCase => {
    return new GetReleasesUseCaseInteractor(
      newGitHubAccessor(githubUrl),
      personalAccessToken
    )
  }
}
