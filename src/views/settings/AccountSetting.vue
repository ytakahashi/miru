<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="block">
      <span class="text-strong clickable" v-on:click="openProfile()">{{ profile }}</span>
      <i class="fas fa-trash-alt clickable" v-on:click="showModal = true"></i>
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
      <input class="url-input" v-model="githubRepositoryUrlInput" placeholder="GitHub Repository URL">
      <button v-on:click="addGitHubRepository()" class="add-repository-button"><i class="fas fa-plus"></i></button>
      <div class="input-invalid" v-if="validationMessage !== ''">{{ validationMessage }}</div>
    </div>

    <ModalWindow v-if="showModal" @cancel="showModal = false" @ok="deleteSetting()">
      <template v-slot:header>
        Are you sure to remove this setting?
      </template>
      <template v-slot:body>
        {{ profile }}
      </template>
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, PropType, Ref, SetupContext } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { ApplicationSetting } from '@/application/domain/model/application'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import ModalWindow from '@/components/ModalWindow.vue'
import { inject } from '@/plugins/di/injector'
import { AccountSettingUseCaseFactoryKey, RepositorySettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import GitHubRepositories from '@/views/settings/GitHubRepositories.vue'

type PropsType = {
  setting: ApplicationSetting
}

export default defineComponent({
  name: 'AccountSetting',
  components: {
    GitHubRepositories,
    ModalWindow
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

    const githubRepositoryUrlInput = ref('')
    const githubRepositorySettings: Ref<Array<RepositorySetting>> = ref([])
    const isEditing = ref(false)
    const validationMessage = ref('')

    const addGitHubRepository = () => {
      if (githubRepositoryUrlInput.value === '') {
        validationMessage.value = 'GitHub repository URL is not specified.'
        return
      }
      const url = new RepositorySetting(githubRepositoryUrlInput.value)
      if (!url.isValid()) {
        validationMessage.value = `Invalid URL: ${githubRepositoryUrlInput.value}`
        return
      }
      const added = repositorySettingUseCase.addRepositorySetting(url)
      if (added) {
        githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
        validationMessage.value = ''
        githubRepositoryUrlInput.value = ''
      } else {
        validationMessage.value = `Duplicated URL: ${githubRepositoryUrlInput.value}`
      }
    }

    const deleteRepository = (url: RepositorySetting) => {
      repositorySettingUseCase.deleteRepositorySetting(url)
      githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()
    }

    const deleteSetting = () => {
      showModal.value = false
      accountSettingUseCase.deleteSetting()
      context.emit('accountDeleted', props.setting)
    }

    const editHandler = (b: boolean) => {
      isEditing.value = b
      if (!isEditing.value) {
        repositorySettingUseCase.setRepositorySettings(githubRepositorySettings.value)
      }
    }

    watch(githubRepositoryUrlInput, () => (validationMessage.value = ''))
    onMounted(() => (githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings()))

    onBeforeRouteLeave(() => {
      if (isEditing.value) {
        repositorySettingUseCase.setRepositorySettings(githubRepositorySettings.value)
      }
    })

    const showModal = ref(false)
    return {
      account,
      profile,
      openProfile,

      githubRepositoryUrlInput,
      githubRepositorySettings,
      isEditing,
      validationMessage,

      addGitHubRepository,
      deleteRepository,
      deleteSetting,
      editHandler,

      showModal
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

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
  @include app.base-input-form();
  width: 50%;
  margin-right: 10px;
}

.add-repository-button {
  @include app.base-button(10px);
  font-size: 12px;
  padding: 3px 8px;
}

.input-invalid {
  color: var(--warning-color);
  text-align: center;
  font-size: 0.9em;
}
</style>
