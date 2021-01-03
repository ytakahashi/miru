<template>
  <div v-if="settings">
    accounts: {{ accounts }}
  </div>

  <input v-model="githubUrlInput" placeholder="GitHub URL (default: https://github.com)">
  <input v-model="personalAccessTokenInput" placeholder="GitHub Personal Access Token">
  <button v-on:click="addSetting()">add setting</button>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ApplicationSettingService } from '@/domain/applicationSettingService'
import { GitHubAccountService } from '@/domain/githubAccountService'
import { ApplicationSetting } from '@/model/application'
import { GitHubUrl } from '@/model/github'
import { GitHubAccount } from '@/model/dto/local'
import { newLocalStorageAccessor } from '@/domain/interface/factory'

type DataType = {
  githubUrlInput: string;
  personalAccessTokenInput: string
  accounts: Array<GitHubAccount>;
  settings: Array<ApplicationSetting>;
  applicationSettingService: ApplicationSettingService;
}

export default defineComponent({
  name: 'SettingView',
  data (): DataType {
    return {
      githubUrlInput: '',
      personalAccessTokenInput: '',
      accounts: [],
      settings: [],
      applicationSettingService: new ApplicationSettingService()
    }
  },
  methods: {
    async addSetting () {
      // TODO: check duplicate
      const url = new GitHubUrl(this.githubUrlInput === undefined ? 'https://github.com' : this.githubUrlInput)
      const github = new GitHubAccountService(url)
      const account = await github.resolvePersonalAccessToken(this.personalAccessTokenInput)
      if (account !== undefined) {
        const setting = {
          configPostfix: account.personalAccessToken
        }
        this.settings.push()
        this.accounts.push(account)
        this.applicationSettingService.addSetting(setting)
      }
    }
  },
  mounted () {
    this.settings = this.applicationSettingService.getSettings()
    for (const s of this.settings) {
      const la = newLocalStorageAccessor(s.configPostfix)
      const act = la.getGitHubAccount()
      if (act !== undefined) {
        this.accounts.push(act)
      }
    }
  }
})
</script>
