<template>
  <div v-for="(accountSetting, index) in accountSettings" :key="index">
    <AccountSetting
      :setting="accountSetting"
      @account-deleted="deleteAccount"
    />
  </div>

  <button v-if="!isEditing" v-on:click="isEditing = !isEditing" class="open-form-button"><i class="fas fa-plus"></i></button>

  <div v-if="isEditing">
    <div class="input-form-block">
      <label class="input-label" for="url-input">GitHub URL (default: https://github.com)</label>
      <input class="setting-input" v-model="githubUrlInput" id="url-input">
      <div class="input-invalid" v-if="isInvalidUrl">{{ errorMessage }}</div>
    </div>
    <div class="input-form-block">
      <label class="input-label" for="pat-input">GitHub Personal Access Token
        <i v-if="!isPatVisible" class="fas fa-eye" v-on:click="viewPersonalAccessToken()"></i>
        <i v-if="isPatVisible" class="fas fa-eye-slash" v-on:click="viewPersonalAccessToken()"></i>
      </label>
      <input class="setting-input" :type="isPatVisible ? 'text' : 'password'" v-model="personalAccessTokenInput" id="pat-input">
      <div class="input-invalid" v-if="isInvalidAccessToken">{{ errorMessage }}</div>
      <div class="input-invalid" v-if="isDuplicated">{{ errorMessage }}</div>
    </div>
    <button v-on:click="addAccount()" class="add-account-button">Add Account</button>
    <button v-on:click="isEditing = !isEditing" class="add-account-button">Cancel</button>
  </div>

  <ThemeSwitch />
  <LoadingImage :loading="loading" @cancel="loading = false" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, Ref } from 'vue'
import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import LoadingImage from '@/components/LoadingImage.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { inject } from '@/plugins/di/injector'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GitHubAccountUseCaseFactoryKey,
  LogUseCaseKey
} from '@/plugins/di/types'
import AccountSetting from '@/views/settings/AccountSetting.vue'

export default defineComponent({
  name: 'SettingView',
  components: {
    AccountSetting,
    LoadingImage,
    ThemeSwitch
  },
  setup () {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const applicationSettingUseCase = inject(ApplicationSettingUseCaseKey)
    const githubAccountUseCaseFactory = inject(GitHubAccountUseCaseFactoryKey)
    const logUseCase = inject(LogUseCaseKey)

    const githubUrlInput = ref('https://github.com')
    const personalAccessTokenInput = ref('')
    const accountSettings: Ref<Array<ApplicationSetting>> = ref([])
    const isDuplicated = ref(false)
    const isInvalidAccessToken = ref(false)
    const isInvalidUrl = ref(false)
    const isEditing = ref(false)
    const isPatVisible = ref(false)
    const errorMessage = ref('')
    const loading = ref(false)

    const onSuccess = (resolved: Account) => {
      const setting = new ApplicationSetting(resolved.getId())
      if (applicationSettingUseCase.hasSetting(setting)) {
        isDuplicated.value = true
        errorMessage.value = `Account ${resolved.userName} is already configured.`
      } else {
        applicationSettingUseCase.addSetting(setting)
        const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(setting)
        accountSettingUseCase.setAccount(resolved)
        accountSettings.value.push(setting)
        isEditing.value = false
        errorMessage.value = ''
      }
    }
    const onFailure = (err: Error) => {
      logUseCase.error(err)
      isInvalidAccessToken.value = true
      errorMessage.value = `Failed to resolve access token: ${personalAccessTokenInput.value}`
    }
    const addAccount = () => {
      loading.value = true
      if (!personalAccessTokenInput.value) {
        isInvalidAccessToken.value = true
        errorMessage.value = 'Access token is required.'
        return
      }
      const url = GitHubUrl.from(githubUrlInput.value)
      if (url === undefined) {
        isInvalidUrl.value = true
        errorMessage.value = `Invalid GitHub URL: ${githubUrlInput.value}`
        return
      }
      const github = githubAccountUseCaseFactory.newGitHubAccountUseCase(url)
      github.resolvePersonalAccessToken(personalAccessTokenInput.value)
        .then(r => onSuccess(r))
        .catch(e => onFailure(e))
        .finally(() => (loading.value = false))
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
      errorMessage,
      loading,
      addAccount,
      deleteAccount,
      viewPersonalAccessToken
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.open-form-button {
  @include app.base-button(15px);
  font-size: 15px;
  padding: 5px 10px;
}

.add-account-button {
  @include app.base-button(3px);
  padding: 5px;
  + button {
    margin-left: 10px;
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
  @include app.base-input-form();
  width: inherit;
}

.input-invalid {
  color: var(--warning-color);
  text-align: left;
  font-size: 0.9em;
}
</style>
