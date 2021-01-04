<template>
  <p>Account: {{ account }}</p>
  <p>Respositories: {{ githubRepositoryUrls }}</p>
  <br />
  <input v-model="githubRepositoryUrl" placeholder="GitHub Repository URL">
  <p v-if="!isValidRepositoryUrl">Invalid URL: {{ githubRepositoryUrl }}</p>
  <button v-on:click="setGitHubRepository()">add reposotory</button>
  <button v-on:click="clearGitHubRepository()">clear</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AccountSettingService } from '@/domain/accountSettingService'
import { ApplicationSetting } from '@/model/application'
import { Account } from '@/model/github'
import { RepositoryUrl } from '@/model/githubRepository'

type DataType = {
  isValidRepositoryUrl: boolean;
  githubRepositoryUrl: string;
  githubRepositoryUrls: Array<string>;
  accountSettingService: AccountSettingService;
}

export default defineComponent({
  name: 'AccountSetting',
  data (): DataType {
    return {
      isValidRepositoryUrl: true,
      githubRepositoryUrl: '',
      githubRepositoryUrls: [],
      accountSettingService: new AccountSettingService(this.setting.configPostfix)
    }
  },
  props: {
    account: {
      type: Account,
      required: true
    },
    setting: {
      type: ApplicationSetting,
      required: true
    }
  },
  methods: {
    setGitHubRepository () {
      const url = new RepositoryUrl(this.githubRepositoryUrl)
      if (!url.isValid()) {
        this.isValidRepositoryUrl = false
        return
      }
      this.isValidRepositoryUrl = true
      this.accountSettingService.setRepositoryUrls([this.githubRepositoryUrl])
      this.githubRepositoryUrls = this.accountSettingService.getRepositoryUrls()
    },
    clearGitHubRepository () {
      if (this.accountSettingService === undefined) {
        return
      }
      this.accountSettingService.clearRepositoryUrls()
      this.githubRepositoryUrl = ''
      this.githubRepositoryUrls = []
    }
  },
  mounted () {
    this.githubRepositoryUrls = this.accountSettingService.getRepositoryUrls()
  }
})
</script>
