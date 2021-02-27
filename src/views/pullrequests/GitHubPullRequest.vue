<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" v-on:click="openPullRequestUrl(repositorySetting)">{{ repositorySetting.displayName() }}</span>
      <button type="button" class="get-button" v-on:click="getPullRequests()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="pullRequests">
      <div class="pr-list-description">
        <button class="clear-button" v-on:click="clearPRs()">clear</button>
        <span>Last fetched: {{ pullRequests.fetchedAtDate() }}</span>
      </div>
      <div v-for="pr in pullRequests.results" :key="pr.url">
        <PullRequestContent :pullRequest="pr" />
      </div>

      <div v-if="!pullRequests.hasContents()" class="clickable" v-on:click="openPullRequestUrl(repositorySetting)">
        There aren’t any open pull requests.
      </div>
    </div>

    <div v-if="total">
      {{ total }}
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of <span class="clickable" v-on:click="openPullRequestUrl(repositorySetting)">{{ repositorySetting.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly, ref } from 'vue'
import { Account, PullRequests, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GitHubRepositoryUseCaseFactoryKey, LogUseCaseKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/pullRequests'
import { getters as queryOption } from '@/store/queryOption'
import PullRequestContent from '@/views/pullrequests/PullRequestContent.vue'

type PropsType = {
  account: Account;
  repositorySetting: RepositorySetting;
}

export default defineComponent({
  name: 'GitHubPullRequest',
  components: {
    LoadingImage,
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
    const logUseCase = inject(LogUseCaseKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openPullRequestUrl = (val: RepositorySetting) => webBrowserUserCase.openUrl(`${val.getUrl()}/pulls`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const githubRepositoryUseCase = githubRepositoryUseCaseFactory.newGitHubRepositoryUseCase(githubUrl, accessToken)
    const loading = ref(false)

    const isFailed = ref(false)
    const getPullRequests = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.pullRequests()
      isFailed.value = await githubRepositoryUseCase.getPullRequests(repositorySetting, option)
        .then((prs: PullRequests) => mutations.replace(prs))
        .then(() => false)
        .catch((e: Error) => {
          logUseCase.error(e)
          return true
        })
        .finally(() => (loading.value = false))
    }
    const clearPRs = (): void => mutations.remove(props.repositorySetting)
    const pullRequests = computed(() => getters.of(props.repositorySetting))
    const total = computed(() => {
      const { value } = pullRequests
      if (value === undefined || !value.hasContents()) {
        return ''
      }
      const count = value.results.length
      const totalCount = value.totalCount
      return totalCount !== undefined
        ? `showing ${count} of ${totalCount} pull requests`
        : ''
    })

    return {
      clearPRs,
      getPullRequests,
      isFailed,
      openPullRequestUrl,
      pullRequests,
      loading,
      total
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';
@use '@/assets/form';

.pr-list-description {
  @include contents.base-content-description(space-between);
}

.get-button {
  @include app.base-button(8px);
  padding: 5px 7px;
}

.clear-button {
  @include app.base-button(2px);
  font-size: 90%;
}
</style>
