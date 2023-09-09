<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" @click="openReleaseUrl(repositorySetting)">{{
        repositorySetting.displayName()
      }}</span>
      <button type="button" class="get-button" @click="getReleases()">
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

    <div v-if="total">
      {{ total }}
    </div>

    <div v-if="isFailed">
      Failed to list releases of
      <span class="clickable" @click="openReleaseUrl(repositorySetting)">{{
        repositorySetting.getUrl()
      }}</span
      >.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>

    <LoadingImage :loading="loading" @cancel="loading = false" />
  </div>
</template>

<script lang="ts">
import { logger } from '@/application/core/logger'
import { Account, GitHubUrl, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import LoadingImage from '@/components/LoadingImage.vue'
import { inject } from '@/plugins/di/injector'
import { GetReleasesUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
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
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)

    const openReleaseUrl = (val: RepositorySetting) =>
      webBrowserUserCase.openUrl(`${val.getUrl()}/releases`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const getReleasesUseCase = getReleasesUseCaseFactory.create(githubUrl, accessToken)
    const loading = ref(false)

    const isFailed = ref(false)
    const getReleases = async (): Promise<void> => {
      loading.value = true
      const { repositorySetting } = props
      const option = queryOption.releases()
      isFailed.value = await getReleasesUseCase
        .execute(repositorySetting, option)
        .then((r: Releases) => mutations.replace(r))
        .then(() => false)
        .catch((e: Error) => {
          logger.error(e)
          return true
        })
        .finally(() => {
          ;(document.activeElement as HTMLElement).blur()
          loading.value = false
        })
    }
    const clearReleases = (): void => mutations.remove(props.repositorySetting)
    const releases = computed(() => getters.of(props.repositorySetting))
    const total = computed(() => {
      const { value } = releases
      if (value === undefined || !value.hasContents()) {
        return ''
      }
      const count = value.results.length
      const totalCount = value.totalCount
      return totalCount !== undefined ? `showing ${count} of ${totalCount} releases` : ''
    })

    return {
      clearReleases,
      getReleases,
      isFailed,
      openReleaseUrl,
      releases,
      loading,
      total,
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
  padding: 5px 7px;
}

.clear-button {
  @include app.base-button(2px);
  font-size: 90%;
}
</style>
