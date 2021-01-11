import { defineComponent, PropType } from 'vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'

type RepositoryTuple = {
  githubRepositoryUseCase: GitHubRepositoryUseCase;
  repositories: Array<RepositoryUrl>;
}

type DataType = {
  tuples: Array<RepositoryTuple>;
}

export default defineComponent({
  props: {
    accountSettingUseCaseFactory: {
      type: Object as PropType<AccountSettingUseCaseFactory>,
      required: true
    },
    applicationSettingUseCase: {
      type: Object as PropType<ApplicationSettingUseCase>,
      required: true
    },
    gitHubRepositoryUseCaseFactory: {
      type: Object as PropType<GitHubRepositoryUseCaseFactory>,
      required: true
    }
  },
  data (): DataType {
    return {
      tuples: []
    }
  },
  mounted () {
    const settings = this.applicationSettingUseCase.getSettings()
    for (const s of settings) {
      const accountSettingUseCase = this.accountSettingUseCaseFactory.newAccountSettingUseCase(s)
      const account = accountSettingUseCase.getAccount()
      const repositoryUrls = accountSettingUseCase.getRepositoryUrls()
      this.tuples.push({
        githubRepositoryUseCase: this.gitHubRepositoryUseCaseFactory.newGitHubRepositoryUseCase(account.githubUrl, account.personalAccessToken),
        repositories: repositoryUrls
      })
    }
  }
})
