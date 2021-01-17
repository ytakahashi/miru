<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :account="accountSetting.account"
      :setting="accountSetting.setting"
      :accountSettingUseCase="accountSetting.useCase"
      @account-deleted="deleteAccount"
    />
  </div>

  <button v-if="!isEditing" v-on:click="isEditing = !isEditing" class="add-button app-font-button"><i class="fas fa-plus"></i></button>

  <div v-if="isEditing">
    <div class="input-form-block">
      <label class="input-label" for="url-input">GitHub URL (default: https://github.com)</label>
      <input class="app-input-form setting-input" v-model="githubUrlInput" id="url-input">
      <div class="input-invalid" v-if="isInvalidUrl">invalid url: {{ githubUrlInput }}</div>
    </div>
    <div class="input-form-block">
      <label class="input-label" for="pat-input">GitHub Personal Access Token
        <i v-if="!isPatVisible" class="fas fa-eye" v-on:click="viewPersonalAccessToken()"></i>
        <i v-if="isPatVisible" class="fas fa-eye-slash" v-on:click="viewPersonalAccessToken()"></i>
      </label>
      <input class="app-input-form setting-input" :type="isPatVisible ? 'text' : 'password'" v-model="personalAccessTokenInput" id="pat-input">
      <div class="input-invalid" v-if="isInvalidAccessToken">invalid access token: {{ personalAccessTokenInput }}</div>
      <div class="input-invalid" v-if="isDuplicated">duplicated personal access token: {{ personalAccessTokenInput }}</div>
    </div>
    <button v-on:click="addSetting()" class="add-buton">Add Account</button>
  </div>

  <ThemeSwitch />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AccountSetting from '@/components/AccountSetting.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
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
  isPatVisible: boolean;
}

export default defineComponent({
  name: 'SettingView',
  components: {
    AccountSetting,
    ThemeSwitch
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
      githubUrlInput: 'https://github.com',
      personalAccessTokenInput: '',
      accountSettings: [],
      isDuplicated: false,
      isInvalidAccessToken: false,
      isInvalidUrl: false,
      isEditing: false,
      isPatVisible: false
    }
  },
  methods: {
    addSetting (): void {
      if (!this.personalAccessTokenInput) {
        this.isInvalidAccessToken = true
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
    },
    viewPersonalAccessToken (): void {
      this.isPatVisible = !this.isPatVisible
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
@import '@/assets/form.scss';

.add-buton {
  padding: 5px;
  border: solid 1px var(--border-color);
  background-color: var(--main-background-color);
  color: var(--main-text-color);
  cursor: pointer;

  &:hover {
    background-color: var(--sub-background-color);
  }
}

.input-form-block {
  width: 350px;
  margin: 15px auto;
}

.input-label {
  display: block;
  text-align: left;
}

.setting-input {
  width: inherit;
}

.input-invalid {
  color: var(--warning-color);
  text-align: left;
  font-size: 0.9em;
}

.add-button {
  font-size: 1.1em;
}

.input {
  width: 75%;
}
</style>
