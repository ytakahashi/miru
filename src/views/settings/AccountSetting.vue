<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" @click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="block">
      <span class="text-strong clickable" @click="openProfile()">{{ profile }}</span>
      <span class="account-edit-toggle">
        <i v-if="!showsPatInput" class="fas fa-edit clickable" @click="showsPatInput = true"></i>
        <i
          v-if="showsPatInput"
          class="fas fa-save clickable"
          @click="updatePersonalAccessToken()"
        ></i>

        <i class="fas fa-trash-alt clickable" @click="showModal = true"></i>

        <i
          v-if="showsPatInput"
          class="far fa-window-close clickable"
          @click="showsPatInput = false"
        ></i>
      </span>

      <div v-if="showsPatInput">
        <label class="input-label" for="pat-input"
          >GitHub Personal Access Token
          <i v-if="!isPatVisible" class="fas fa-eye" @click="isPatVisible = true"></i>
          <i v-if="isPatVisible" class="fas fa-eye-slash" @click="isPatVisible = false"></i>
        </label>
        <input
          v-model="account.personalAccessToken"
          class="pat-input"
          :type="isPatVisible ? 'text' : 'password'"
        />
      </div>
    </div>

    <div class="block">
      <GitHubRepositories
        :repository-settings="githubRepositorySettings"
        :editing="isEditing"
        @edit="editHandler"
        @delete-repository="deleteRepository"
      />
    </div>

    <div v-if="isEditing" class="block">
      <input
        v-model="githubRepositoryUrlInput"
        class="url-input"
        placeholder="GitHub Repository URL"
      />
      <button class="add-repository-button" @click="addGitHubRepository()">
        <i class="fas fa-plus"></i>
      </button>
      <div v-if="validationMessage !== ''" class="input-invalid">
        {{ validationMessage }}
      </div>
    </div>

    <ModalWindow v-if="showModal" @cancel="showModal = false" @ok="deleteSetting()">
      <template #header> Are you sure to remove this setting? </template>
      <template #body>
        {{ profile }}
      </template>
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { ApplicationSetting } from '@/application/domain/model/application'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import ModalWindow from '@/components/ModalWindow.vue'
import { inject } from '@/plugins/di/injector'
import {
  AccountSettingUseCaseFactoryKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserUserCaseKey,
} from '@/plugins/di/types'
import GitHubRepositories from '@/views/settings/GitHubRepositories.vue'
import { PropType, Ref, computed, defineComponent, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

type PropsType = {
  setting: ApplicationSetting
}

export default defineComponent({
  name: 'AccountSetting',
  components: {
    GitHubRepositories,
    ModalWindow,
  },
  props: {
    setting: {
      type: Object as PropType<ApplicationSetting>,
      required: true,
    },
  },
  emits: {
    accountDeleted: null,
  },
  setup(props: PropsType, { emit }) {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const repositorySettingUseCaseFactory = inject(RepositorySettingUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(
      props.setting
    )
    const repositorySettingUseCase = repositorySettingUseCaseFactory.newRepositorySettingUseCase(
      props.setting
    )

    const account = accountSettingUseCase.getAccount()
    const profile = computed(() => `${account.userName}@${account.githubUrl.getDomain()}`)
    const showsPatInput = ref(false)
    const isPatVisible = ref(false)
    const openProfile = () => webBrowserUserCase.openUrl(account.profileUrl)
    const updatePersonalAccessToken = () => {
      accountSettingUseCase.setAccount(account)
      showsPatInput.value = false
    }

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
      emit('accountDeleted', props.setting)
    }

    const editHandler = (b: boolean, orderedRepositories: string[]) => {
      isEditing.value = b
      if (!isEditing.value) {
        const newRepositories = orderedRepositories.map(repo => {
          const found = githubRepositorySettings.value.find(r => r.displayName() === repo)
          if (found === undefined) {
            throw Error(`Unexpected : ${repo}`)
          }
          return found
        })
        repositorySettingUseCase.setRepositorySettings(newRepositories)
      }
    }

    watch(githubRepositoryUrlInput, () => (validationMessage.value = ''))
    onMounted(
      () => (githubRepositorySettings.value = repositorySettingUseCase.getRepositorySettings())
    )

    onBeforeRouteLeave(() => {
      if (isEditing.value) {
        repositorySettingUseCase.setRepositorySettings(githubRepositorySettings.value)
      }
    })

    const showModal = ref(false)
    return {
      account,
      profile,
      showsPatInput,
      isPatVisible,
      openProfile,
      updatePersonalAccessToken,

      githubRepositoryUrlInput,
      githubRepositorySettings,
      isEditing,
      validationMessage,

      addGitHubRepository,
      deleteRepository,
      deleteSetting,
      editHandler,

      showModal,
    }
  },
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

.account-edit-toggle {
  i {
    margin-right: 5px;
  }
}

.pat-input {
  @include app.base-input-form();
  & {
    width: 80%;
    margin-right: 10px;
  }
}

.url-input {
  @include app.base-input-form();
  & {
    width: 50%;
    margin-right: 10px;
  }
}

.add-repository-button {
  @include app.base-button(10px);
  & {
    font-size: 12px;
    padding: 3px 8px;
  }
}

.input-invalid {
  color: var(--warning-color);
  text-align: center;
  font-size: 0.9em;
}
</style>
