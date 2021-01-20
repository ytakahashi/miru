<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="block">
      <span class="profile-url" v-on:click="openProfile()">{{ profile }}</span>
      <i class="fas fa-trash-alt clickable" v-on:click="deleteSetting()"></i>
    </div>

    <div class="block" v-if="githubRepositoryUrls.length > 0">
      <GitHubRepositories
        :repositoryUrls="githubRepositoryUrls"
        :editing="isEditing"
        @edit="editHandler"
        @delete-repository="deleteRepository"
      />
    </div>

    <div v-if="isEditing" class="block">
      <input class="app-input-form url-input" v-model="githubRepositoryUrlInput" placeholder="GitHub Repository URL">
      <button v-on:click="addGitHubRepository()" class="app-font-button"><i class="fas fa-plus"></i></button>
      <p v-if="!isValidRepositoryUrl">Invalid URL: {{ githubRepositoryUrlInput }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watch, PropType, Ref, SetupContext } from 'vue'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { AccountSettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { ApplicationSetting } from '@/domain/model/application'
import { RepositoryUrl } from '@/domain/model/githubRepository'

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
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const accountSettingUseCase = accountSettingUseCaseFactory?.newAccountSettingUseCase(props.setting)
    if (accountSettingUseCase === undefined) {
      throw new Error('Unexpected: accountSettingUseCase should be defined')
    }
    const account = accountSettingUseCase.getAccount()
    const profile = computed(() => `${account.userName}@${account.githubUrl.getDomain()}`)

    const githubRepositoryUrlInput = ref('')
    const githubRepositoryUrls: Ref<Array<RepositoryUrl>> = ref([])
    const isValidRepositoryUrl = ref(true)
    const isEditing = ref(false)

    const addGitHubRepository = () => {
      if (githubRepositoryUrlInput.value === '') {
        return
      }
      const url = new RepositoryUrl(githubRepositoryUrlInput.value)
      if (!url.isValid()) {
        isValidRepositoryUrl.value = false
        return
      }
      accountSettingUseCase.addRepositoryUrl(url)
      githubRepositoryUrls.value = accountSettingUseCase.getRepositoryUrls()
      isValidRepositoryUrl.value = true
      githubRepositoryUrlInput.value = ''
    }

    const deleteRepository = (url: RepositoryUrl) => {
      accountSettingUseCase.deleteRepositoryUrl(url)
      githubRepositoryUrls.value = accountSettingUseCase.getRepositoryUrls()
    }

    const deleteSetting = () => {
      accountSettingUseCase.deleteSetting()
      context.emit('accountDeleted', props.setting)
    }

    const editHandler = (b: boolean) => {
      isEditing.value = b
      if (!isEditing.value) {
        accountSettingUseCase.setRepositoryUrls(githubRepositoryUrls.value)
      }
    }

    const openProfile = () => webBrowserUserCase?.openUrl(account.profileUrl)

    watch(githubRepositoryUrlInput, () => {
      isValidRepositoryUrl.value = true
    })

    onMounted(() => {
      githubRepositoryUrls.value = accountSettingUseCase.getRepositoryUrls()
    })

    return {
      account,
      githubRepositoryUrlInput,
      githubRepositoryUrls,
      isValidRepositoryUrl,
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
