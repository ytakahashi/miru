import {
  newGitHubAccessor,
  newLocalStorageAccessor,
} from '@/application/domain/interface/factory.js'
import { ApplicationSetting } from '@/application/domain/model/application.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import {
  AccountSettingUseCase,
  AccountSettingUseCaseFactory,
} from '@/application/usecase/accountSetting.js'
import {
  ApplicationSettingUseCase,
  ApplicationSettingUseCaseFactory,
} from '@/application/usecase/applicationSetting.js'
import {
  GitHubAccountUseCase,
  GitHubAccountUseCaseFactory,
} from '@/application/usecase/githubAccount.js'
import {
  GetCommitHistoryUseCase,
  GetCommitHistoryUseCaseFactory,
  GetIssuesUseCase,
  GetIssuesUseCaseFactory,
  GetPullRequestsUseCase,
  GetPullRequestsUseCaseFactory,
  GetReleasesUseCase,
  GetReleasesUseCaseFactory,
} from '@/application/usecase/githubRepository.js'
import { AccountSettingUseCaseInteractor } from '@/application/usecase/interactor/accountSettingUseCaseInteractor.js'
import { ApplicationSettingUseCaseInteractor } from '@/application/usecase/interactor/applicationSettingUseCaseInteractor.js'
import { GitHubAccountUseCaseInteractor } from '@/application/usecase/interactor/githubAccountUseCaseInteractor.js'
import {
  GetCommitHistoryUseCaseInteractor,
  GetIssuesUseCaseInteractor,
  GetPullRequestsUseCaseInteractor,
  GetReleasesUseCaseInteractor,
} from '@/application/usecase/interactor/githubRepositoryUseCaseInteractor.js'
import { RepositorySettingUseCaseInteractor } from '@/application/usecase/interactor/repositorySettingUseCaseInteractor.js'
import {
  RepositorySettingUseCase,
  RepositorySettingUseCaseFactory,
} from '@/application/usecase/repositorySetting.js'

export class AccountSettingUseCaseFactoryImpl implements AccountSettingUseCaseFactory {
  newAccountSettingUseCase = (setting: ApplicationSetting): AccountSettingUseCase => {
    return new AccountSettingUseCaseInteractor(newLocalStorageAccessor(setting.configPostfix))
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
    return new RepositorySettingUseCaseInteractor(newLocalStorageAccessor(setting.configPostfix))
  }
}

export class GetCommitHistoryUseCaseFactoryImpl implements GetCommitHistoryUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetCommitHistoryUseCase => {
    return new GetCommitHistoryUseCaseInteractor(newGitHubAccessor(githubUrl), personalAccessToken)
  }
}

export class GetIssuesUseCaseFactoryImpl implements GetIssuesUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetIssuesUseCase => {
    return new GetIssuesUseCaseInteractor(newGitHubAccessor(githubUrl), personalAccessToken)
  }
}

export class GetPullRequestsUseCaseFactoryImpl implements GetPullRequestsUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetPullRequestsUseCase => {
    return new GetPullRequestsUseCaseInteractor(newGitHubAccessor(githubUrl), personalAccessToken)
  }
}

export class GetReleasesUseCaseFactoryImpl implements GetReleasesUseCaseFactory {
  create = (githubUrl: GitHubUrl, personalAccessToken: string): GetReleasesUseCase => {
    return new GetReleasesUseCaseInteractor(newGitHubAccessor(githubUrl), personalAccessToken)
  }
}
