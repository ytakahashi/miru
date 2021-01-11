<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :account="accountSetting.account"
      :setting="accountSetting.setting"
      :accountSettingUseCase="accountSetting.useCase"
      @account-deleted="deleteAccount"
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
import { defineComponent, PropType } from 'vue'
import AccountSetting from '@/components/AccountSetting.vue'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { GitHubAccountUseCaseFactory } from '@/usecase/githubAccount'

type AccountSettingTriple = {
  account: Account;
  setting: ApplicationSetting;
  useCase: AccountSettingUseCase;
}

type DataType = {
  githubUrlInput: string;
  personalAccessTokenInput: string
  accountSettings: Array<AccountSettingTriple>;
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
  props: {
    accountSettingUseCaseFactory: {
      type: Object as PropType<AccountSettingUseCaseFactory>,
      required: true
    },
    applicationSettingUseCase: {
      type: Object as PropType<ApplicationSettingUseCase>,
      required: true
    },
    gitHubAccountUseCaseFactory: {
      type: Object as PropType<GitHubAccountUseCaseFactory>,
      required: true
    }
  },
  data (): DataType {
    return {
      githubUrlInput: '',
      personalAccessTokenInput: '',
      accountSettings: [],
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
      const github = this.gitHubAccountUseCaseFactory.newGitHubAccountUseCase(url)
      github.resolvePersonalAccessToken(this.personalAccessTokenInput)
        .then(r => this.onSuccess(r))
        .catch(e => this.onFailure(e))
    },
    onSuccess (resolved: Account): void {
      const setting = new ApplicationSetting(resolved.getId())
      if (this.applicationSettingUseCase.hasSetting(setting)) {
        this.isDuplicated = true
        this.isEditing = false
      } else {
        this.applicationSettingUseCase.addSetting(setting)
        const accountSettingUseCase = this.accountSettingUseCaseFactory.newAccountSettingUseCase(setting)
        accountSettingUseCase.setAccount(resolved)
        this.accountSettings.push({
          account: resolved,
          setting: setting,
          useCase: accountSettingUseCase
        })
      }
    },
    onFailure (err: Error): void {
      console.error(err)
      this.isInvalidAccessToken = true
    },
    deleteAccount (setting: ApplicationSetting): void {
      this.applicationSettingUseCase.removeSetting(setting)
      this.refreshAccounts()
    },
    refreshAccounts (): void {
      this.accountSettings.splice(0)
      const settings = this.applicationSettingUseCase.getSettings()
      for (const setting of settings) {
        const accountSettingUseCase = this.accountSettingUseCaseFactory.newAccountSettingUseCase(setting)
        const account = accountSettingUseCase.getAccount()
        this.accountSettings.push({
          account: account,
          setting: setting,
          useCase: accountSettingUseCase
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
