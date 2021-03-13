<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" v-on:click="openCommitsUrl(repositorySetting)">{{ repositorySetting.displayName() }}</span>
      <button type="button" class="get-button" v-on:click="getCommits()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="commits">
      <div class="issue-list-description">
        <button class="clear-button" v-on:click="clearCommits()">clear</button>
        <span>Last fetched: {{ commits.fetchedAtDate() }}</span>
      </div>
      <div v-for="commit in commits.results" :key="commit.commitUrl">
        <CommitContent :commit="commit" />
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list commit history of <span class="clickable" v-on:click="openCommitsUrl(repositorySetting)">{{ repositorySetting.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly, ref } from 'vue'
import { Account, CommitHistory, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetCommitHistoryUseCaseFactoryKey, LogUseCaseKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/commits'
import { getters as queryOption } from '@/store/queryOption'
import CommitContent from '@/views/commits/CommitContent.vue'

type PropsType = {
  account: Account;
  repositorySetting: RepositorySetting;
}

export default defineComponent({
  name: 'CommitHistory',
  components: {
    CommitContent,
    LoadingImage
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
    const getCommitHistoryUseCaseFactory = inject(GetCommitHistoryUseCaseFactoryKey)
    const logUseCase = inject(LogUseCaseKey)
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openCommitsUrl = (val: RepositorySetting) => webBrowserUserCase.openUrl(`${val.getUrl()}/commits`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getCommitHistoryUseCase = getCommitHistoryUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const isFailed = ref(false)
    const getCommits = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.commits()
      isFailed.value = await getCommitHistoryUseCase.execute(repositorySetting, option)
        .then((ch: CommitHistory) => mutations.replace(ch))
        .then(() => false)
        .catch((e: Error) => {
          logUseCase.error(e)
          return true
        })
        .finally(() => (loading.value = false))
    }
    const clearCommits = (): void => mutations.remove(props.repositorySetting)
    const commits = computed(() => getters.of(props.repositorySetting))

    return {
      clearCommits,
      getCommits,
      isFailed,
      openCommitsUrl,
      commits,
      loading
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.issue-list-description {
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
