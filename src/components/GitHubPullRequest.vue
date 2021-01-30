<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" v-on:click="openRepositorySetting(repositorySetting)">{{ repositorySetting.displayName() }}</span>
      <button type="button" class="app-input-button" v-on:click="getPullRequests()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="pullRequests">
      <div class="text-tiny align-right">Last fetched: {{ pullRequests.fetchedAtDate() }}</div>
      <div v-for="pr in pullRequests.results" :key="pr.url">
        <PullRequestContent :pullRequest="pr" />
      </div>

      <div v-if="!pullRequests.hasContents()" class="clickable" v-on:click="openPullRequestUrl(repositorySetting)">
        There aren’t any open pull requests.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of <span class="clickable" v-on:click="openPullRequestUrl(repositorySetting)">{{ repositorySetting.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, readonly, ref } from 'vue'
import { Account, PullRequests, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey, GitHubRepositoryUseCaseFactoryKey } from '@/di/types'
import { getters, mutations } from '@/store/pullRequests'
import { getters as queryOption } from '@/store/queryOption'

type PropsType = {
  account: Account;
  repositorySetting: RepositorySetting;
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
    repositorySetting: {
      type: RepositorySetting,
      required: true
    }
  },
  setup (props: PropsType) {
    const githubRepositoryUseCaseFactory = inject(GitHubRepositoryUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openRepositorySetting = (val: RepositorySetting) => webBrowserUserCase.openUrl(val.getUrl())
    const openPullRequestUrl = (val: RepositorySetting) => webBrowserUserCase.openUrl(`${val.getUrl()}/pulls`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const githubRepositoryUseCase = githubRepositoryUseCaseFactory.newGitHubRepositoryUseCase(githubUrl, accessToken)

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
      const { repositorySetting } = props
      const option = queryOption.pullRequests()
      githubRepositoryUseCase.getPullRequests(repositorySetting, option)
        .then(onSuccess)
        .catch(onFailure)
    }

    return {
      getPullRequests,
      isFailed,
      openRepositorySetting,
      openPullRequestUrl
    }
  },
  computed: {
    pullRequests (): PullRequests|undefined {
      return getters.of(this.repositorySetting)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/contents.scss';
@import '@/assets/form.scss';
</style>
