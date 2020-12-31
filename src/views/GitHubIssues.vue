<template>
  <h1>View issues.</h1>

  <div v-for="repo in repositoryUrls" :key="repo">
    <GitHubIssue :repositoryUrl="repo"></GitHubIssue>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserSettingService } from '@/domain/userSettingService'
import GitHubIssue from '@/components/GitHubIssue.vue'

const apiEndpoint = 'https://api.github.com/graphql'
type DataType = {
  repositoryUrls: Array<string>;
  userSettingService: UserSettingService;
}

export default defineComponent({
  name: 'GitHubIssues',
  components: {
    GitHubIssue
  },
  data (): DataType {
    return {
      repositoryUrls: [],
      userSettingService: new UserSettingService(apiEndpoint)
    }
  },
  methods: {
    listRepositories (): void {
      this.repositoryUrls = this.userSettingService.getRepositoryUrls()
    }
  },
  mounted () {
    this.listRepositories()
  }
})
</script>
