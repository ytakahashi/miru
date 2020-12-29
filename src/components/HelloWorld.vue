<template>
  <div class="hello">
    <input v-model="pat" placeholder="personal access token">
    <p>Access Token: {{ pat }}</p>
    <button v-on:click="setPat()">store</button>

    <p v-if="userName">Hello, {{ userName }}</p>
    <p v-if="profileUrl">profile: {{ profileUrl }}</p>
    <button v-if="githubRepositoryService" v-on:click="getIssues()">get issues</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserSettingService } from '@/domain/userSettingService'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'

const apiEndpoint = 'https://api.github.com/graphql'

type DataType = {
  pat: string;
  userName: string;
  profileUrl: string;
  userSettingService: UserSettingService;
  githubRepositoryService?: GitHubRepositoryService;
}

export default defineComponent({
  name: 'HelloWorld',
  data (): DataType {
    return {
      pat: '',
      userName: '',
      profileUrl: '',
      userSettingService: new UserSettingService(apiEndpoint),
      githubRepositoryService: undefined
    }
  },
  methods: {
    setPat () {
      this.userSettingService.updatePat(this.pat)
      this.updateProfile()
    },
    async getIssues () {
      // todo
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
    this.updateProfile()
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
