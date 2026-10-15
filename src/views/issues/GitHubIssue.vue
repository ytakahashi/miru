<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" @click="openIssueUrl(repositorySetting)">{{
        repositorySetting.displayName()
      }}</span>
      <button type="button" class="get-button" @click="getIssues().catch(errorHandler)">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="issues">
      <div class="issue-list-description">
        <button class="clear-button" @click="clearIssues()">clear</button>
        <span>Last fetched: {{ issues.fetchedAtDate() }}</span>
      </div>
      <div v-for="issue in issues.results" :key="issue.url">
        <IssueContent :issue="issue" />
      </div>

      <div v-if="!issues.hasContents()" class="clickable" @click="openIssueUrl(repositorySetting)">
        There aren't any {{ queryState }} issues.
      </div>
    </div>

    <div v-if="issues" class="list-footer">
      <span v-if="total">{{ total }}</span>
      <button
        v-if="canLoadMore"
        type="button"
        class="load-more-button"
        :disabled="loadingMore"
        @click="loadMore().catch(showError)"
      >
        {{ loadingMore ? 'Loading…' : 'Load more' }}
      </button>
    </div>

    <div v-if="isFailed">
      Failed to list issues of
      <span class="clickable" @click="openIssueUrl(repositorySetting)">{{
        repositorySetting.getUrl()
      }}</span
      >.<br />
      {{ failedMessage }}
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { Account, GitHubUrl, Issues } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetIssuesUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/issues'
import { getters as queryOption } from '@/store/queryOption'
import IssueContent from '@/views/issues/IssueContent.vue'
import { computed, defineComponent, readonly, ref } from 'vue'

type PropsType = {
  account: Account
  repositorySetting: RepositorySetting
}

export default defineComponent({
  name: 'GitHubIssue',
  components: {
    IssueContent,
    LoadingImage,
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
  },
  setup(props: PropsType) {
    const getIssuesUseCaseFactory = inject(GetIssuesUseCaseFactoryKey)
    const webBrowser = inject(WebBrowserKey)
    const logger = inject(LoggerKey)

    const openIssueUrl = (val: RepositorySetting): void =>
      webBrowser.openUrl(`${val.getUrl()}/issues`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getIssuesUseCase = getIssuesUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const queryState = ref('')
    const isFailed = ref(false)
    const failedMessage = ref('')
    const getIssues = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.issues()
      queryState.value = option.states?.join('/').toLowerCase() || ''
      await getIssuesUseCase
        .execute(repositorySetting, option)
        .then((i: Issues) => mutations.replace(i))
        .then(() => {
          ;(document.activeElement as HTMLElement).blur()
          loading.value = false
          isFailed.value = false
        })
    }
    const showError = (e: Error): void => {
      logger.error(e)
      failedMessage.value = e.message
      isFailed.value = true
    }
    const errorHandler = (e: Error): void => {
      showError(e)
      loading.value = false
    }
    const clearIssues = (): void => mutations.remove(props.repositorySetting)
    const issues = computed(() => getters.of(props.repositorySetting))
    const loadingMore = ref(false)
    const canLoadMore = computed(() => issues.value?.hasNextPage() === true)
    const loadMore = async (): Promise<void> => {
      const source = issues.value
      const option = source?.nextPageOption()
      if (source === undefined || option === undefined || loadingMore.value) {
        return
      }
      loadingMore.value = true
      try {
        const next = await getIssuesUseCase.execute(props.repositorySetting, option)
        // Replaced or removed lists must ignore both results and errors from older requests.
        if (issues.value !== source) {
          return
        }
        mutations.append(next)
        isFailed.value = false
      } catch (error) {
        if (issues.value === source) {
          throw error
        }
      } finally {
        loadingMore.value = false
      }
    }
    const total = computed(() => {
      const { value } = issues
      if (value === undefined || !value.hasContents()) {
        return ''
      }
      const count = value.results.length
      const totalCount = value.totalCount
      return totalCount !== undefined ? `showing ${count} of ${totalCount} issues` : ''
    })

    return {
      clearIssues,
      errorHandler,
      showError,
      getIssues,
      queryState,
      isFailed,
      failedMessage,
      openIssueUrl,
      issues,
      loading,
      loadingMore,
      canLoadMore,
      loadMore,
      total,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.issue-list-description {
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

.list-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.load-more-button {
  @include app.base-button(2px);
  & {
    align-self: center;
    padding: 3px 8px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
    transform: none;
  }
}
</style>
