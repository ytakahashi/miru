<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" @click="openReleaseUrl(repositorySetting)">{{
        repositorySetting.displayName()
      }}</span>
      <button type="button" class="get-button" @click="getReleases().catch(errorHandler)">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="releases">
      <div class="release-list-description">
        <button class="clear-button" @click="clearReleases()">clear</button>
        <span>Last fetched: {{ releases.fetchedAtDate() }}</span>
      </div>
      <div v-for="release in releases.results" :key="release.url">
        <ReleaseContent :release="release" />
      </div>

      <div
        v-if="!releases.hasContents()"
        class="clickable"
        @click="openReleaseUrl(repositorySetting)"
      >
        There aren’t any releases.
      </div>
    </div>

    <LoadMoreFooter
      v-if="releases"
      :summary="summary"
      :can-load-more="canLoadMore"
      :loading="loadingMore"
      :error-message="loadMoreError"
      @load-more="loadMore"
    />

    <div v-if="isFailed">
      Failed to list releases of
      <span class="clickable" @click="openReleaseUrl(repositorySetting)">{{
        repositorySetting.getUrl()
      }}</span
      >.<br />
      {{ failedMessage }}
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { Account, GitHubUrl, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import LoadMoreFooter from '@/components/LoadMoreFooter.vue'
import { usePagedList } from '@/composables/usePagedList'
import { inject } from '@/plugins/di/injector'
import { GetReleasesUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters as queryOption } from '@/store/queryOption'
import { getters, mutations } from '@/store/releases'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'
import { computed, defineComponent, readonly, ref } from 'vue'

type PropsType = {
  account: Account
  repositorySetting: RepositorySetting
}

export default defineComponent({
  name: 'GitHubRelease',
  components: {
    LoadingImage,
    LoadMoreFooter,
    ReleaseContent,
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
    const getReleasesUseCaseFactory = inject(GetReleasesUseCaseFactoryKey)
    const webBrowser = inject(WebBrowserKey)
    const logger = inject(LoggerKey)

    const openReleaseUrl = (val: RepositorySetting): void =>
      webBrowser.openUrl(`${val.getUrl()}/releases`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getReleasesUseCase = getReleasesUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const isFailed = ref(false)
    const failedMessage = ref('')
    const getReleases = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.releases()
      await getReleasesUseCase
        .execute(repositorySetting, option)
        .then((r: Releases) => mutations.replace(r))
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
    const clearReleases = (): void => mutations.remove(props.repositorySetting)
    const releases = computed(() => getters.of(props.repositorySetting))
    const { summary, canLoadMore, loadingMore, loadMoreError, loadMore } = usePagedList({
      list: releases,
      itemName: 'releases',
      fetchPage: option => getReleasesUseCase.execute(props.repositorySetting, option),
      appendPage: mutations.append,
      logError: e => logger.error(e),
    })

    return {
      clearReleases,
      errorHandler,
      getReleases,
      isFailed,
      failedMessage,
      openReleaseUrl,
      releases,
      loading,
      summary,
      canLoadMore,
      loadingMore,
      loadMoreError,
      loadMore,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.release-list-description {
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
