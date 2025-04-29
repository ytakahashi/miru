<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" @click="openCommitsUrl(repositorySetting)">{{
        repositorySetting.displayName()
      }}</span>
      <button type="button" class="get-button" @click="getCommits().catch(errorHandler)">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="commits">
      <div class="issue-list-description">
        <button class="clear-button" @click="clearCommits()">clear</button>
        <span>Last fetched: {{ commits.fetchedAtDate() }}</span>
      </div>
      <div v-for="commit in commits.results" :key="commit.commitUrl">
        <CommitContent :commit="commit" />
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list commit history of
      <span class="clickable" @click="openCommitsUrl(repositorySetting)">{{
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
import { Account, CommitHistory, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetCommitHistoryUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/commits'
import { getters as queryOption } from '@/store/queryOption'
import CommitContent from '@/views/commits/CommitContent.vue'
import { computed, defineComponent, readonly, ref, watch } from 'vue'

type PropsType = {
  account: Account
  repositorySetting: RepositorySetting
  fetchTrigger: string
}

export default defineComponent({
  name: 'CommitHistory',
  components: {
    CommitContent,
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
    fetchTrigger: {
      type: String,
      required: true,
    },
  },
  setup(props: PropsType) {
    const getCommitHistoryUseCaseFactory = inject(GetCommitHistoryUseCaseFactoryKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openCommitsUrl = (val: RepositorySetting): void =>
      webBrowserUserCase.openUrl(`${val.getUrl()}/commits`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getCommitHistoryUseCase = getCommitHistoryUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const isFailed = ref(false)
    const failedMessage = ref('')
    const getCommits = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.commits()
      await getCommitHistoryUseCase
        .execute(repositorySetting, option)
        .then((ch: CommitHistory) => mutations.replace(ch))
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
    const clearCommits = (): void => mutations.remove(props.repositorySetting)
    const commits = computed(() => getters.of(props.repositorySetting))

    watch(
      () => props.fetchTrigger,
      async (newVal, _) => {
        if (newVal === props.repositorySetting.getCategory()) {
          await getCommits().catch(errorHandler)
        }
      }
    )

    return {
      clearCommits,
      errorHandler,
      getCommits,
      isFailed,
      failedMessage,
      openCommitsUrl,
      commits,
      loading,
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
</style>
