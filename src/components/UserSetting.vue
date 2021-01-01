<template>
  <input v-model="personalAccessToken" placeholder="personal access token">
  <p>Access Token: {{ personalAccessToken }}</p>
  <button v-on:click="setGitHubPersonalAccessToken()">store</button>

  <p v-if="userName">Hello, {{ userName }}</p>
  <p v-if="profileUrl">profile: {{ profileUrl }}</p>

  <input v-model="githubRepositoryUrl" placeholder="GitHub Repository URL">
  <p>Repositoies: {{ githubRepositoryUrls }}</p>
  <p v-if="!isValidRepositoryUrl">Invalid URL: {{ githubRepositoryUrl }}</p>
  <button v-on:click="setGitHubRepository()">add reposotory</button>
  <button v-on:click="clearGitHubRepository()">clear</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserSettingService } from '@/domain/userSettingService'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
import { RepositoryUrl } from '@/model/githubRepository'

const apiEndpoint = 'https://api.github.com/graphql'

type DataType = {
  personalAccessToken: string;
  userName: string;
  profileUrl: string;
  isValidRepositoryUrl: boolean;
  githubRepositoryUrl: string;
  githubRepositoryUrls: Array<string>;
  userSettingService: UserSettingService;
  githubRepositoryService?: GitHubRepositoryService;
}

export default defineComponent({
  name: 'UserSetting',
  data (): DataType {
    return {
      personalAccessToken: '',
      userName: '',
      profileUrl: '',
      isValidRepositoryUrl: true,
      githubRepositoryUrl: '',
      githubRepositoryUrls: [],
      userSettingService: new UserSettingService(apiEndpoint),
      githubRepositoryService: undefined
    }
  },
  methods: {
    setGitHubPersonalAccessToken () {
      this.userSettingService.updatePersonalAccessToken(this.personalAccessToken)
      this.updateProfile()
    },
    setGitHubRepository () {
      if (this.userSettingService === undefined) {
        return
      }
      const url = new RepositoryUrl(this.githubRepositoryUrl)
      if (!url.isValid()) {
        this.isValidRepositoryUrl = false
        return
      }
      this.isValidRepositoryUrl = true
      this.userSettingService.setRepositoryUrls([this.githubRepositoryUrl])
      this.githubRepositoryUrls = this.userSettingService.getRepositoryUrls()
    },
    clearGitHubRepository () {
      if (this.userSettingService === undefined) {
        return
      }
      this.userSettingService.clearRepositoryUrls()
      this.githubRepositoryUrl = ''
      this.githubRepositoryUrls = []
    },
    async updateProfile () {
      try {
        const user = await this.userSettingService.getUser()
        if (user !== undefined) {
          this.userName = user.login
          this.profileUrl = user.url
          this.githubRepositoryService = new GitHubRepositoryService(apiEndpoint, this.userSettingService.getGithubPersonalAccessToken())
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted () {
    await this.updateProfile()
    if (this.userSettingService !== undefined) {
      this.githubRepositoryUrls = this.userSettingService.getRepositoryUrls()
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
