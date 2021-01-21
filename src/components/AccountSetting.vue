<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="block">
      <span class="profile-url" v-on:click="openProfile()">{{ profile }}</span>
      <i class="fas fa-trash-alt clickable" v-on:click="deleteSetting()"></i>
    </div>

    <div class="block">
      <GitHubRepositories
        :repositorySettings="githubRepositorySettings"
        :editing="isEditing"
        @edit="editHandler"
        @delete-repository="deleteRepository"
      />
    </div>

    <div v-if="isEditing" class="block">
      <input class="app-input-form url-input" v-model="githubRepositorySettingInput" placeholder="GitHub Repository URL">
      <button v-on:click="addGitHubRepository()" class="app-font-button"><i class="fas fa-plus"></i></button>
      <p v-if="!isValidRepositorySetting">Invalid URL: {{ githubRepositorySettingInput }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, PropType, Ref, SetupContext } from 'vue'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { inject } from '@/di/injector'
import { AccountSettingUseCaseFactoryKey, RepositorySettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { ApplicationSetting } from '@/domain/model/application'
import { RepositorySetting } from '@/domain/model/githubRepository'

type PropsType = {
  setting: ApplicationSetting
}

export default defineComponent({
  name: 'AccountSetting',
  components: {
    GitHubRepositories
  },
  emits: {
    accountDeleted: null
  },
  props: {
    setting: {
      type: Object as PropType<ApplicationSetting>,
      required: true
    }
  },
  setup (props: PropsType, context: SetupContext) {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const repositorySettingUseCaseFactory = inject(RepositorySettingUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(props.setting)
    const repositorySettingUseCase = repositorySettingUseCaseFactory.newRepositorySettingUseCase(props.setting)

    const account = accountSettingUseCase.getAccount()
    const profile = computed(() => `${account.userName}@${account.githubUrl.getDomain()}`)

    const githubRepositorySettingInput = ref('')
    const githubRepositorySettings: Ref<Array<RepositorySetting>> = ref([])
    const isValidRepositorySetting = ref(true)
    const isEditing = ref(false)

    const addGitHubRepository = () => {
      if (githubRepositorySettingInput.value === '') {
        return
      }
      const url = new RepositorySetting(githubRepositorySettingInput.value)
      if (!url.isValid()) {
        isValidRepositorySetting.value = false
        return
      }
      repositorySettingUseCase.addRepositorySetting(url)
      githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
      isValidRepositorySetting.value = true
      githubRepositorySettingInput.value = ''
    }

    const deleteRepository = (url: RepositorySetting) => {
      repositorySettingUseCase.deleteRepositorySetting(url)
      githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
    }

    const deleteSetting = () => {
      accountSettingUseCase.deleteSetting()
      context.emit('accountDeleted', props.setting)
    }

    const editHandler = (b: boolean) => {
      isEditing.value = b
      if (!isEditing.value) {
        repositorySettingUseCase.setRepositorySettings(githubRepositorySettings.value)
      }
    }

    const openProfile = () => webBrowserUserCase.openUrl(account.profileUrl)

    watch(githubRepositorySettingInput, () => {
      isValidRepositorySetting.value = true
    })

    onMounted(() => {
      githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
    })

    return {
      account,
      githubRepositorySettingInput,
      githubRepositorySettings,
      isValidRepositorySetting,
      isEditing,
      openProfile,
      addGitHubRepository,
      deleteRepository,
      deleteSetting,
      editHandler,
      profile
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/form.scss';
@import '@/assets/app.scss';

$card-border-radius: 7px;

img {
  width: 6em;
}

.profile {
  width: 30em;
  margin: 0 auto;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border: 1px solid #c0c0c0;
  border-radius: $card-border-radius;
  transition: 0.4s;
}

.profile-img {
  cursor: pointer;
  padding: 0.3em;
  background-color: var(--sub-background-color);
  border-radius: $card-border-radius;

  :hover {
    opacity: 0.5;
  }
}

.profile-url {
  cursor: pointer;
  font-weight: bold;
  padding: 0.3em;
}

.block {
  margin-top: 10px;
  margin-bottom: 10px;
}

.url-input {
  width: 250px;
  margin-right: 10px;
}
</style>
