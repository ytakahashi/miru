<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepositorySetting(repositorySetting)">{{ repositorySetting.displayName() }}</span>
      <button type="button" class="app-input-button" v-on:click="getIssues()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="issues">
      <div class="last-fetched-date">Last fetched: {{ issues.fetchedAtDate() }}</div>
      <div v-for="issue in issues.results" :key="issue.url">
        <IssueContent :issue="issue" />
      </div>

      <div v-if="!issues.hasContents()" class="clickable" v-on:click="openIssueUrl(repositorySetting)">
        There aren’t any open issues.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list issues of <span class="clickable" v-on:click="openIssueUrl(repositorySetting)">{{ repositorySetting.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, readonly, ref } from 'vue'
import IssueContent from '@/components/IssueContent.vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey, GitHubRepositoryUseCaseFactoryKey } from '@/di/types'
import { Account, Issues, GitHubUrl } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/issues'
import { getters as queryOption } from '@/store/queryOption'

type PropsType = {
  account: Account;
  repositorySetting: RepositorySetting;
}

export default defineComponent({
  name: 'GitHubIssue',
  components: {
    IssueContent
  },
  props: {
    account: {
      type: Account,
      required: true
    },
    repositorySetting: {
      type: RepositorySetting,
      required: true
    }
  },
  setup (props: PropsType) {
    const githubRepositoryUseCaseFactory = inject(GitHubRepositoryUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openRepositorySetting = (val: RepositorySetting) => webBrowserUserCase.openUrl(val.getUrl())
    const openIssueUrl = (val: RepositorySetting) => webBrowserUserCase.openUrl(`${val.getUrl()}/issues`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const githubRepositoryUseCase = githubRepositoryUseCaseFactory.newGitHubRepositoryUseCase(githubUrl, accessToken)

    const isFailed = ref(false)
    const onSuccess = (i: Issues) => {
      isFailed.value = false
      mutations.replace(i)
    }
    const onFailure = (e: Error) => {
      // TODO: log
      console.error(e)
      isFailed.value = true
    }
    const getIssues = (): void => {
      const { repositorySetting } = props
      const option = queryOption.issues()
      githubRepositoryUseCase.getIssues(repositorySetting, option)
        .then(onSuccess)
        .catch(onFailure)
    }

    return {
      getIssues,
      isFailed,
      openRepositorySetting,
      openIssueUrl
    }
  },
  computed: {
    issues (): Issues|undefined {
      return getters.of(this.repositorySetting)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/form.scss';
</style>
