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

    <div v-if="total">
      {{ total }}
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
import { logger } from '@/application/core/logger'
import { Account, GitHubUrl, Issues } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetIssuesUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
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
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openIssueUrl = (val: RepositorySetting) =>
      webBrowserUserCase.openUrl(`${val.getUrl()}/issues`)

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
    const errorHandler = (e: Error) => {
      logger.error(e)
      failedMessage.value = e.message
      loading.value = false
      isFailed.value = true
    }
    const clearIssues = (): void => mutations.remove(props.repositorySetting)
    const issues = computed(() => getters.of(props.repositorySetting))
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
      getIssues,
      queryState,
      isFailed,
      failedMessage,
      openIssueUrl,
      issues,
      loading,
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
</style>
