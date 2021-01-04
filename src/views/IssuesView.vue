<template>
  <h1>View issues.</h1>
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="(repo, index) in t.repositories" :key="index">
      <GitHubIssue :repositoryUrl="repo" :githubRepositoryService="t.gitHubRepositoryService"></GitHubIssue>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AccountSettingService } from '@/domain/accountSettingService'
import { ApplicationSettingService } from '@/domain/applicationSettingService'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
import GitHubIssue from '@/components/GitHubIssue.vue'
import { RepositoryUrl } from '@/model/githubRepository'

type RepositoryTuple = {
  gitHubRepositoryService: GitHubRepositoryService;
  repositories: Array<RepositoryUrl>;
}

type DataType = {
  applicationSettingService: ApplicationSettingService;
  tuples: Array<RepositoryTuple>;
}

export default defineComponent({
  name: 'IssuesView',
  components: {
    GitHubIssue
  },
  data (): DataType {
    return {
      applicationSettingService: new ApplicationSettingService(),
      tuples: []
    }
  },
  mounted () {
    const settings = this.applicationSettingService.getSettings()
    for (const s of settings) {
      const accountSettingService = new AccountSettingService(s.configPostfix)
      const account = accountSettingService.getAccount()
      const repositories = accountSettingService.getRepositoryUrls()
      const repositoryUrls = repositories
        .map(url => new RepositoryUrl(url))
        .filter(v => v.isValid())
      this.tuples.push({
        gitHubRepositoryService: new GitHubRepositoryService(account.githubUrl, account.personalAccessToken),
        repositories: repositoryUrls
      })
    }
  }
})
</script>
