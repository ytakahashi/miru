<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting :account="accountSetting.account" :setting="accountSetting.setting" />
  </div>

  <input v-model="githubUrlInput" placeholder="GitHub URL (default: https://github.com)">
  <input v-model="personalAccessTokenInput" placeholder="GitHub Personal Access Token">
  <button v-on:click="addSetting()">add setting</button>

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
      applicationSettingService: new ApplicationSettingService()
    }
  },
  methods: {
    async addSetting () {
      // TODO: check duplicate
      const url = new GitHubUrl(this.githubUrlInput === '' ? 'https://github.com' : this.githubUrlInput)
      const github = new GitHubAccountService(url)
      const resolved = await github.resolvePersonalAccessToken(this.personalAccessTokenInput)
      if (resolved !== undefined) {
        const setting = {
          configPostfix: resolved.personalAccessToken
        }
        this.accountSettings.push({
          account: resolved,
          setting: setting
        })
        this.applicationSettingService.addSetting(setting)
        const accountSettingService = new AccountSettingService(setting.configPostfix)
        accountSettingService.setAccount(resolved)
      }
    }
  },
  mounted () {
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
})
</script>
