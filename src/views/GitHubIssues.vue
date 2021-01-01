<template>
  <h1>View issues.</h1>

  <div v-if="gitHubRepositoryService">
    <div v-for="repo in repositoryUrls" :key="repo">
      <GitHubIssue :repositoryUrl="repo" :githubRepositoryService="gitHubRepositoryService"></GitHubIssue>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
import { UserSettingService } from '@/domain/userSettingService'
import GitHubIssue from '@/components/GitHubIssue.vue'
import { RepositoryUrl } from '@/model/githubRepository'

const apiEndpoint = 'https://api.github.com/graphql'
type DataType = {
  repositoryUrls: Array<RepositoryUrl>;
  userSettingService: UserSettingService;
  gitHubRepositoryService?: GitHubRepositoryService;
}

export default defineComponent({
  name: 'GitHubIssues',
  components: {
    GitHubIssue
  },
  data (): DataType {
    return {
      repositoryUrls: [],
      userSettingService: new UserSettingService(apiEndpoint),
      gitHubRepositoryService: undefined
    }
  },
  methods: {
    listRepositories (): void {
      const urls = this.userSettingService.getRepositoryUrls()
      this.repositoryUrls = urls
        .map(url => new RepositoryUrl(url))
        .filter(v => v.isValid())
    },
    initGitHubRepositoryService (): void {
      this.gitHubRepositoryService = new GitHubRepositoryService(
        apiEndpoint, this.userSettingService.getGithubPersonalAccessToken()
      )
    }
  },
  mounted () {
    this.listRepositories()
    this.initGitHubRepositoryService()
  }
})
</script>
