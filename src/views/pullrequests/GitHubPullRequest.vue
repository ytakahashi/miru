<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" @click="openPullRequestUrl(repositorySetting)">{{
        repositorySetting.displayName()
      }}</span>
      <button type="button" class="get-button" @click="getPullRequests().catch(errorHandler)">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="pullRequests">
      <div class="pr-list-description">
        <button class="clear-button" @click="clearPRs()">clear</button>
        <span>Last fetched: {{ pullRequests.fetchedAtDate() }}</span>
      </div>
      <div v-for="pr in pullRequests.results" :key="pr.url">
        <PullRequestContent :pull-request="pr" />
      </div>

      <div
        v-if="!pullRequests.hasContents()"
        class="clickable"
        @click="openPullRequestUrl(repositorySetting)"
      >
        There aren't any {{ queryState }} pull requests.
      </div>
    </div>

    <div v-if="total">
      {{ total }}
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of
      <span class="clickable" @click="openPullRequestUrl(repositorySetting)">{{
        repositorySetting.getUrl()
      }}</span
      >.<br />
      {{ failedMessage }}
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { logger } from '@/application/core/logger'
import { Account, GitHubUrl, PullRequests } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetPullRequestsUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/pullRequests'
import { getters as queryOption } from '@/store/queryOption'
import PullRequestContent from '@/views/pullrequests/PullRequestContent.vue'
import { computed, defineComponent, readonly, ref, watch } from 'vue'

type PropsType = {
  account: Account
  repositorySetting: RepositorySetting
  fetchTrigger: string
}

export default defineComponent({
  name: 'GitHubPullRequest',
  components: {
    LoadingImage,
    PullRequestContent,
  },
  props: {
    account: {
      type: Account,
      required: true,
    },
    repositorySetting: {
      type: RepositorySetting,
      required: true,
    },
    fetchTrigger: {
      type: String,
      required: true,
    },
  },
  setup(props: PropsType) {
    const getPullRequestsUseCaseFactory = inject(GetPullRequestsUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openPullRequestUrl = (val: RepositorySetting): void =>
      webBrowserUserCase.openUrl(`${val.getUrl()}/pulls`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getPullRequestsUseCase = getPullRequestsUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const queryState = ref('')
    const isFailed = ref(false)
    const failedMessage = ref('')
    const getPullRequests = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.pullRequests()
      queryState.value = option.states?.join('/').toLowerCase() || ''
      await getPullRequestsUseCase
        .execute(repositorySetting, option)
        .then((prs: PullRequests) => mutations.replace(prs))
        .then(() => {
          ;(document.activeElement as HTMLElement).blur()
          loading.value = false
          isFailed.value = false
        })
    }
    const errorHandler = (e: Error): void => {
      logger.error(e)
      failedMessage.value = e.message
      loading.value = false
      isFailed.value = true
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
      return totalCount !== undefined ? `showing ${count} of ${totalCount} pull requests` : ''
    })

    watch(
      () => props.fetchTrigger,
      async (newVal, _) => {
        if (newVal === props.repositorySetting.getCategory()) {
          await getPullRequests().catch(errorHandler)
        }
      }
    )

    return {
      clearPRs,
      errorHandler,
      getPullRequests,
      queryState,
      isFailed,
      failedMessage,
      openPullRequestUrl,
      pullRequests,
      loading,
      total,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.pr-list-description {
  @include contents.base-content-description(space-between);
}

.get-button {
  @include app.rotate-button(8px);
  & {
    padding: 5px 7px;
  }
}

.clear-button {
  @include app.base-button(2px);
  & {
    font-size: 90%;
  }
}
</style>
