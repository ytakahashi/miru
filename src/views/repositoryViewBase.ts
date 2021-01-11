import { defineComponent } from 'vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { AccountSettingService } from '@/usecase/accountSettingService'
import { ApplicationSettingService } from '@/usecase/applicationSettingService'
import { GitHubRepositoryService } from '@/usecase/githubRepositoryService'

type RepositoryTuple = {
  gitHubRepositoryService: GitHubRepositoryService;
  repositories: Array<RepositoryUrl>;
}

type DataType = {
  applicationSettingService: ApplicationSettingService;
  tuples: Array<RepositoryTuple>;
}

export default defineComponent({
  data (): DataType {
    return {
      applicationSettingService: new ApplicationSettingService(),
      tuples: []
    }
  },
  mounted () {
    const settings = this.applicationSettingService.getSettings()
    for (const s of settings) {
      const accountSettingService = AccountSettingService.init(s.configPostfix)
      const account = accountSettingService.getAccount()
      const repositoryUrls = accountSettingService.getRepositoryUrls()
      this.tuples.push({
        gitHubRepositoryService: GitHubRepositoryService.init(account.githubUrl, account.personalAccessToken),
        repositories: repositoryUrls
      })
    }
  }
})
