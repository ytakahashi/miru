<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :account="accountSetting.account"
      :setting="accountSetting.setting"
      @account-deleted="refreshAccounts"
    />
  </div>

  <input v-model="githubUrlInput" placeholder="GitHub URL (default: https://github.com)">
  <input v-model="personalAccessTokenInput" placeholder="GitHub Personal Access Token">
  <button v-on:click="addSetting()">add setting</button>
  <div v-if="isDuplicated">duplicated personal access token: {{ personalAccessTokenInput }}</div>
  <div v-if="isInvalidAccessToken">invalid input: {{ githubUrlInput }}, {{ personalAccessTokenInput }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountSetting from '@/components/AccountSetting.vue'
import { AccountSettingService } from '@/domain/accountSettingService'
import { ApplicationSettingService } from '@/domain/applicationSettingService'
import { GitHubAccountService } from '@/domain/githubAccountService'
import { ApplicationSetting } from '@/model/application'
import { Account, GitHubUrl } from '@/model/github'

type AccountSettingTuple = {
  account: Account;
  setting: ApplicationSetting;
}

type DataType = {
  githubUrlInput: string;
  personalAccessTokenInput: string
  accountSettings: Array<AccountSettingTuple>;
  applicationSettingService: ApplicationSettingService;
  isDuplicated: boolean;
  isInvalidAccessToken: boolean;
}

export default defineComponent({
  name: 'SettingView',
  components: {
    AccountSetting
  },
  data (): DataType {
    return {
      githubUrlInput: '',
      personalAccessTokenInput: '',
      accountSettings: [],
      applicationSettingService: new ApplicationSettingService(),
      isDuplicated: false,
      isInvalidAccessToken: false
    }
  },
  methods: {
    async addSetting () {
      const url = this.githubUrlInput === '' ? new GitHubUrl() : new GitHubUrl(this.githubUrlInput)
      const github = new GitHubAccountService(url)
      github.resolvePersonalAccessToken(this.personalAccessTokenInput)
        .then(r => this.onSuccess(r))
        .catch(e => this.onFailure(e))
    },
    onSuccess (resolved: Account|undefined) {
      if (resolved === undefined) {
        this.isInvalidAccessToken = true
        return
      }
      const setting = new ApplicationSetting(resolved.personalAccessToken)
      this.accountSettings.push({
        account: resolved,
        setting: setting
      })
      const isAdded = this.applicationSettingService.addSetting(setting)
      if (isAdded) {
        const accountSettingService = new AccountSettingService(setting.configPostfix)
        accountSettingService.setAccount(resolved)
      } else {
        this.isDuplicated = true
      }
    },
    onFailure (err: Error) {
      console.error(JSON.stringify(err, undefined, 2))
      this.isInvalidAccessToken = true
    },
    refreshAccounts () {
      this.accountSettings.splice(0)
      const settings = this.applicationSettingService.getSettings()
      for (const setting of settings) {
        const accountSettingService = new AccountSettingService(setting.configPostfix)
        const account = accountSettingService.getAccount()
        this.accountSettings.push({
          account: account,
          setting: setting
        })
      }
    }
  },
  mounted () {
    this.refreshAccounts()
  }
})
</script>
