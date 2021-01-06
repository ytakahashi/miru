<template>
  <div class="profile">
    <div class="profile-img" v-on:click="openProfile()">
      <img :src="account.avatarUrl" />
    </div>
    <span class="profile-name">{{ profile }}</span>
    <button type="button" v-on:click="deleteSetting()">
      <i class="fas fa-trash-alt"></i>
    </button>
    <p>Respositories:</p>
    <div v-for="url in githubRepositoryUrls" :key="url.getUrl()">
      <GitHubRepository :repositoryUrl="url" />
    </div>
    <br />
    <input v-model="githubRepositoryUrlInput" placeholder="GitHub Repository URL">
    <p v-if="!isValidRepositoryUrl">Invalid URL: {{ githubRepositoryUrlInput }}</p>
    <button v-on:click="addGitHubRepository()">add repository</button>
    <button v-on:click="clearGitHubRepositories()">clear</button>
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { shell } from 'electron'
import GitHubRepository from '@/components/GitHubRepository.vue'
import { AccountSettingService } from '@/domain/accountSettingService'
import { ApplicationSettingService } from '@/domain/applicationSettingService'
import { ApplicationSetting } from '@/model/application'
import { Account } from '@/model/github'
import { RepositoryUrl } from '@/model/githubRepository'

type DataType = {
  isValidRepositoryUrl: boolean;
  githubRepositoryUrlInput: string;
  githubRepositoryUrls: Array<RepositoryUrl>;
  accountSettingService: AccountSettingService;
}

export default defineComponent({
  name: 'AccountSetting',
  components: {
    GitHubRepository
  },
  data (): DataType {
    return {
      isValidRepositoryUrl: true,
      githubRepositoryUrlInput: '',
      githubRepositoryUrls: [],
      accountSettingService: new AccountSettingService(this.setting.configPostfix)
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
      this.accountSettingService.addRepositoryUrls(url)
      this.githubRepositoryUrls = this.accountSettingService.getRepositoryUrls()
      this.githubRepositoryUrlInput = ''
    },
    clearGitHubRepositories (): void {
      this.accountSettingService.clearRepositoryUrls()
      this.githubRepositoryUrlInput = ''
      this.githubRepositoryUrls = []
    },
    deleteSetting (): void {
      const applicationSettingService = new ApplicationSettingService()
      applicationSettingService.removeSetting(this.setting)
      this.accountSettingService.deleteSetting()
      this.$emit('accountDeleted')
    },
    openProfile (): void {
      shell.openExternal(this.account.profileUrl)
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
    this.githubRepositoryUrls = this.accountSettingService.getRepositoryUrls()
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
  font-weight: bold;
  padding: 0.3em;
  margin: 0;
}
</style>
