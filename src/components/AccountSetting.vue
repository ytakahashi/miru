<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="block">
      <span class="text-strong clickable" v-on:click="openProfile()">{{ profile }}</span>
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
      <p v-if="validationMessage !== ''">{{ validationMessage }} URL: {{ githubRepositorySettingInput }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, PropType, Ref, SetupContext } from 'vue'
import { ApplicationSetting } from '@/application/domain/model/application'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { inject } from '@/di/injector'
import { AccountSettingUseCaseFactoryKey, RepositorySettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'

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
    const openProfile = () => webBrowserUserCase.openUrl(account.profileUrl)

    const githubRepositorySettingInput = ref('')
    const githubRepositorySettings: Ref<Array<RepositorySetting>> = ref([])
    const isEditing = ref(false)
    const validationMessage = ref('')

    const addGitHubRepository = () => {
      if (githubRepositorySettingInput.value === '') {
        return
      }
      const url = new RepositorySetting(githubRepositorySettingInput.value)
      if (!url.isValid()) {
        validationMessage.value = 'Invalid'
        return
      }
      const added = repositorySettingUseCase.addRepositorySetting(url)
      if (added) {
        githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
        validationMessage.value = ''
        githubRepositorySettingInput.value = ''
      } else {
        validationMessage.value = 'Duplicated'
      }
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

    watch(githubRepositorySettingInput, () => (validationMessage.value = ''))
    onMounted(() => (githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()))

    return {
      account,
      profile,
      openProfile,

      githubRepositorySettingInput,
      githubRepositorySettings,
      isEditing,
      validationMessage,

      addGitHubRepository,
      deleteRepository,
      deleteSetting,
      editHandler
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/form.scss';
@import '@/assets/app.scss';

$card-border-radius: 7px;

.profile {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
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

  img {
    width: 17%;
  }
}

.block {
  margin-top: 10px;
  margin-bottom: 10px;
}

.url-input {
  width: 50%;
  margin-right: 10px;
}
</style>
