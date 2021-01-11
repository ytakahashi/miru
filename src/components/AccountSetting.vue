<template>
  <div class="profile">
    <div v-if="!account.githubUrl.isEnterprise()" class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <div class="profile-header">
      <span class="profile-name" v-on:click="openProfile()">{{ profile }}</span>
      <i class="fas fa-trash-alt" v-on:click="deleteSetting()"></i>
    </div>

    <div class="repositories">
      <GitHubRepositories
        :repositoryUrls="githubRepositoryUrls"
        :editable="isEditing"
        @edit="editHandler"
        @delete-repository="deleteRepository"
      />
    </div>

    <div v-if="isEditing" class="repositry-input">
      <input v-model="githubRepositoryUrlInput" placeholder="GitHub Repository URL">
      <button v-on:click="addGitHubRepository()" class="add-button"><i class="fas fa-plus"></i></button>
      <p v-if="!isValidRepositoryUrl">Invalid URL: {{ githubRepositoryUrlInput }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { shell } from 'electron'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { ApplicationSetting } from '@/domain/model/application'
import { Account } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { AccountSettingUseCase } from '@/usecase/accountSetting'

type DataType = {
  isValidRepositoryUrl: boolean;
  githubRepositoryUrlInput: string;
  githubRepositoryUrls: Array<RepositoryUrl>;
  isEditing: boolean;
}

export default defineComponent({
  name: 'AccountSetting',
  components: {
    GitHubRepositories
  },
  data (): DataType {
    return {
      isValidRepositoryUrl: true,
      githubRepositoryUrlInput: '',
      githubRepositoryUrls: [],
      isEditing: false
    }
  },
  emits: {
    accountDeleted: null
  },
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true
    },
    setting: {
      type: Object as PropType<ApplicationSetting>,
      required: true
    },
    accountSettingUseCase: {
      type: Object as PropType<AccountSettingUseCase>,
      required: true
    }
  },
  methods: {
    addGitHubRepository (): void {
      const url = new RepositoryUrl(this.githubRepositoryUrlInput)
      if (!url.isValid()) {
        this.isValidRepositoryUrl = false
        return
      }
      this.isValidRepositoryUrl = true
      this.accountSettingUseCase.addRepositoryUrl(url)
      this.githubRepositoryUrls = this.accountSettingUseCase.getRepositoryUrls()
      this.githubRepositoryUrlInput = ''
    },
    clearGitHubRepositories (): void {
      this.accountSettingUseCase.clearRepositoryUrls()
      this.githubRepositoryUrlInput = ''
      this.githubRepositoryUrls = []
    },
    deleteSetting (): void {
      this.accountSettingUseCase.deleteSetting()
      this.$emit('accountDeleted', this.setting)
    },
    openProfile (): void {
      shell.openExternal(this.account.profileUrl)
    },
    editHandler (b: boolean): void {
      this.isEditing = b
    },
    deleteRepository (url: RepositoryUrl): void {
      this.accountSettingUseCase.deleteRepositoryUrl(url)
      this.githubRepositoryUrls = this.accountSettingUseCase.getRepositoryUrls()
    }
  },
  watch: {
    githubRepositoryUrlInput: function () {
      this.isValidRepositoryUrl = true
    }
  },
  computed: {
    profile (): string {
      return `${this.account.userName}@${this.account.githubUrl.getDomain()}`
    }
  },
  mounted () {
    this.githubRepositoryUrls = this.accountSettingUseCase.getRepositoryUrls()
  }
})
</script>

<style scoped lang="scss">
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
  background: #fff0f0;
  border-radius: $card-border-radius;

  :hover {
    opacity: 0.5;
  }
}

.profile-name {
  cursor: pointer;
  font-weight: bold;
  padding: 0.3em;
}

.profile-header {
  margin-top: 0.7em;
}

.repositories {
  margin-top: 0.7em;
}

.repositry-input {
  margin-top: 1em;
}

.add-button {
  margin-left: 0.5em;
  background-color: transparent;
  border-radius: 40%;
  outline: none;
}
</style>
