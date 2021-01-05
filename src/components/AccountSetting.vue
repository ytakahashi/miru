<template>
  <p>Account: {{ account }}</p>
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
  <button v-on:click="deleteSetting()">delete this setting</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
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
    }
  },
  watch: {
    githubRepositoryUrlInput: function () {
      this.isValidRepositoryUrl = true
    }
  },
  mounted () {
    this.githubRepositoryUrls = this.accountSettingService.getRepositoryUrls()
  }
})
</script>
