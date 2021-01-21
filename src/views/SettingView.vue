<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :setting="accountSetting"
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
    <button v-on:click="addAccount()" class="add-account-button">Add Account</button>
  </div>

  <ThemeSwitch />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, Ref } from 'vue'
import AccountSetting from '@/components/AccountSetting.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { inject } from '@/di/injector'
import { AccountSettingUseCaseFactoryKey, ApplicationSettingUseCaseKey, GitHubAccountUseCaseFactoryKey } from '@/di/types'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'

export default defineComponent({
  name: 'SettingView',
  components: {
    AccountSetting,
    ThemeSwitch
  },
  setup () {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const applicationSettingUseCase = inject(ApplicationSettingUseCaseKey)
    const githubAccountUseCaseFactory = inject(GitHubAccountUseCaseFactoryKey)

    const githubUrlInput = ref('https://github.com')
    const personalAccessTokenInput = ref('')
    const accountSettings: Ref<Array<ApplicationSetting>> = ref([])
    const isDuplicated = ref(false)
    const isInvalidAccessToken = ref(false)
    const isInvalidUrl = ref(false)
    const isEditing = ref(false)
    const isPatVisible = ref(false)

    const onSuccess = (resolved: Account) => {
      const setting = new ApplicationSetting(resolved.getId())
      if (applicationSettingUseCase.hasSetting(setting)) {
        isDuplicated.value = true
      } else {
        applicationSettingUseCase.addSetting(setting)
        const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(setting)
        accountSettingUseCase.setAccount(resolved)
        accountSettings.value.push(setting)
      }
      isEditing.value = false
    }
    const onFailure = (err: Error) => {
      // TODO: log
      console.error(err)
      isInvalidAccessToken.value = true
    }
    const addAccount = () => {
      if (!personalAccessTokenInput.value) {
        isInvalidAccessToken.value = true
        return
      }
      const url = GitHubUrl.from(githubUrlInput.value)
      if (url === undefined) {
        isInvalidUrl.value = true
        return
      }
      const github = githubAccountUseCaseFactory.newGitHubAccountUseCase(url)
      github.resolvePersonalAccessToken(personalAccessTokenInput.value)
        .then(r => onSuccess(r))
        .catch(e => onFailure(e))
    }

    const refreshAccounts = () => {
      accountSettings.value.splice(0)
      const settings = applicationSettingUseCase.getSettings()
      for (const setting of settings) {
        accountSettings.value.push(setting)
      }
    }

    const deleteAccount = (setting: ApplicationSetting) => {
      applicationSettingUseCase.removeSetting(setting)
      refreshAccounts()
    }

    const viewPersonalAccessToken = () => {
      isPatVisible.value = !isPatVisible.value
    }

    watch(githubUrlInput, () => {
      isDuplicated.value = false
      isInvalidAccessToken.value = false
      isInvalidUrl.value = false
    })

    watch(personalAccessTokenInput, () => {
      isDuplicated.value = false
      isInvalidAccessToken.value = false
    })

    onMounted(() => refreshAccounts())

    return {
      githubUrlInput,
      personalAccessTokenInput,
      accountSettings,
      isDuplicated,
      isInvalidAccessToken,
      isInvalidUrl,
      isEditing,
      isPatVisible,

      addAccount,
      deleteAccount,
      viewPersonalAccessToken
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/form.scss';

.add-account-button {
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
</style>
