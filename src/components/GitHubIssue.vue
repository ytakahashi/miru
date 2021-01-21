<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepositoryUrl(repositoryUrl)">{{ repositoryUrl.asString() }}</span>
      <button type="button" class="app-input-button" v-on:click="getIssues()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="issues">
      <div class="last-fetched-date">Last fetched: {{ issues.fetchedAtDate() }}</div>
      <div v-for="issue in issues.results" :key="issue.url">
        <IssueContent :issue="issue" />
      </div>

      <div v-if="!issues.hasContents()" class="clickable" v-on:click="openIssueUrl(repositoryUrl)">
        There aren’t any open issues.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list issues of <span class="clickable" v-on:click="openIssueUrl(repositoryUrl)">{{ repositoryUrl.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, readonly, ref, PropType } from 'vue'
import IssueContent from '@/components/IssueContent.vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey, GitHubRepositoryUseCaseFactoryKey } from '@/di/types'
import { Account, Issues, GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/issues'
import { Option } from '@/usecase/githubRepository'

type PropsType = {
  account: Account;
  repositoryUrl: RepositoryUrl;
  option: Option;
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
    repositoryUrl: {
      type: RepositoryUrl,
      required: true
    },
    option: {
      type: Object as PropType<Option>,
      required: true
    }
  },
  setup (props: PropsType) {
    const githubRepositoryUseCaseFactory = inject(GitHubRepositoryUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openRepositoryUrl = (val: RepositoryUrl) => webBrowserUserCase.openUrl(val.getUrl())
    const openIssueUrl = (val: RepositoryUrl) => webBrowserUserCase.openUrl(`${val.getUrl()}/issues`)

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
      const { repositoryUrl, option } = props
      githubRepositoryUseCase.getIssues(repositoryUrl, option)
        .then(onSuccess)
        .catch(onFailure)
    }

    return {
      getIssues,
      isFailed,
      openRepositoryUrl,
      openIssueUrl
    }
  },
  computed: {
    issues (): Issues|undefined {
      return getters.of(this.repositoryUrl)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/form.scss';
</style>
