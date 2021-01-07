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
  <div v-if="isInvalidAccessToken">invalid access token: <span v-if="githubUrlInput">{{ githubUrlInput }}, </span> {{ personalAccessTokenInput }}</div>
  <div v-if="isInvalidUrl">invalid url: {{ githubUrlInput }}</div>
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
  isInvalidUrl: boolean;
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
      isInvalidAccessToken: false,
      isInvalidUrl: false
    }
  },
  methods: {
    addSetting (): void {
      const url = GitHubUrl.from(this.githubUrlInput)
      if (url === undefined) {
        this.isInvalidUrl = true
        return
      }
      const github = new GitHubAccountService(url)
      github.resolvePersonalAccessToken(this.personalAccessTokenInput)
        .then(r => this.onSuccess(r))
        .catch(e => this.onFailure(e))
    },
    onSuccess (resolved: Account): void {
      const setting = new ApplicationSetting(resolved.getId())
      if (this.applicationSettingService.hasSetting(setting)) {
        this.isDuplicated = true
      } else {
        this.applicationSettingService.addSetting(setting)
        const accountSettingService = new AccountSettingService(setting.configPostfix)
        accountSettingService.setAccount(resolved)
        this.accountSettings.push({
          account: resolved,
          setting: setting
        })
      }
    },
    onFailure (err: Error): void {
      console.error(err)
      this.isInvalidAccessToken = true
    },
    refreshAccounts (): void {
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
  watch: {
    githubUrlInput: function () {
      this.isDuplicated = false
      this.isInvalidAccessToken = false
      this.isInvalidUrl = false
    },
    personalAccessTokenInput: function () {
      this.isDuplicated = false
      this.isInvalidAccessToken = false
    }
  },
  mounted () {
    this.refreshAccounts()
  }
})
</script>
