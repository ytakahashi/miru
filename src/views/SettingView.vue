<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :account="accountSetting.account"
      :setting="accountSetting.setting"
      @account-deleted="refreshAccounts"
    />
  </div>

  <button v-if="!isEditing" v-on:click="isEditing = !isEditing" class="add-button"><i class="fas fa-plus"></i></button>

  <div v-if="isEditing">
    <input class="input" v-model="githubUrlInput" placeholder="GitHub URL (default: https://github.com)">
    <br />
    <input class="input" v-model="personalAccessTokenInput" placeholder="GitHub Personal Access Token">
    <br />
    <button v-on:click="addSetting()">add setting</button>
    <div v-if="isDuplicated">duplicated personal access token: {{ personalAccessTokenInput }}</div>
    <div v-if="isInvalidAccessToken">invalid access token: <span v-if="githubUrlInput">{{ githubUrlInput }}, </span> {{ personalAccessTokenInput }}</div>
    <div v-if="isInvalidUrl">invalid url: {{ githubUrlInput }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountSetting from '@/components/AccountSetting.vue'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'
import { AccountSettingService } from '@/usecase/accountSettingService'
import { ApplicationSettingService } from '@/usecase/applicationSettingService'
import { GitHubAccountService } from '@/usecase/githubAccountService'

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
  isEditing: boolean;
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
      isInvalidUrl: false,
      isEditing: false
    }
  },
  methods: {
    addSetting (): void {
      if (!this.personalAccessTokenInput) {
        return
      }
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
        this.isEditing = false
      } else {
        this.applicationSettingService.addSetting(setting)
        const accountSettingService = AccountSettingService.init(setting.configPostfix)
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
        const accountSettingService = AccountSettingService.init(setting.configPostfix)
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

<style scoped lang="scss">
.add-button {
  font-size: 1.1em;
  background-color: transparent;
  border-radius: 50%;
  outline: none;
}

.input {
  width: 75%;
}
</style>
