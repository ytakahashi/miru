<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepositoryUrl(repositoryUrl)">{{ repositoryUrl.asString() }}</span>
      <button type="button" class="app-input-button" v-on:click="getPullRequests()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="pullRequests">
      <div class="last-fetched-date">Last fetched: {{ pullRequests.fetchedAtDate() }}</div>
      <div v-for="pr in pullRequests.results" :key="pr.url">
        <PullRequestContent :pullRequest="pr" />
      </div>

      <div v-if="!pullRequests.hasContents()" class="clickable" v-on:click="openPullRequestUrl(repositoryUrl)">
        There aren’t any open pull requests.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of <span class="clickable" v-on:click="openPullRequestUrl(repositoryUrl)">{{ repositoryUrl.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, readonly, ref, PropType } from 'vue'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { WebBrowserUserCaseKey, GitHubRepositoryUseCaseFactoryKey } from '@/di/types'
import { Account, PullRequests, GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/pullRequests'
import { Option } from '@/usecase/githubRepository'

type PropsType = {
  account: Account;
  repositoryUrl: RepositoryUrl;
  option: Option;
}

export default defineComponent({
  name: 'GitHubPullRequest',
  components: {
    PullRequestContent
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
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openRepositoryUrl = (val: RepositoryUrl) => webBrowserUserCase?.openUrl(val.getUrl())
    const openPullRequestUrl = (val: RepositoryUrl) => webBrowserUserCase?.openUrl(`${val.getUrl()}/pulls`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const githubRepositoryUseCase = inject(GitHubRepositoryUseCaseFactoryKey)?.newGitHubRepositoryUseCase(githubUrl, accessToken)

    const isFailed = ref(false)
    const onSuccess = (prs: PullRequests) => {
      isFailed.value = false
      mutations.replace(prs)
    }
    const onFailure = (e: Error) => {
      // TODO: log
      console.error(e)
      isFailed.value = true
    }
    const getPullRequests = (): void => {
      const { repositoryUrl, option } = props
      githubRepositoryUseCase?.getPullRequests(repositoryUrl, option)
        .then(onSuccess)
        .catch(onFailure)
    }

    return {
      getPullRequests,
      isFailed,
      openRepositoryUrl,
      openPullRequestUrl
    }
  },
  computed: {
    pullRequests (): PullRequests|undefined {
      return getters.of(this.repositoryUrl)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/form.scss';
</style>
