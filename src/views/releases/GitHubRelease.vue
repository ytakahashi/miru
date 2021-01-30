<template>
  <div class="content-list">
    <div class="content-list-header">
      <span class="text-strong clickable" v-on:click="openRepositorySetting(repositorySetting)">{{ repositorySetting.displayName() }}</span>
      <button type="button" class="app-input-button" v-on:click="getReleases()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="releases">
      <div class="text-tiny align-right">Last fetched: {{ releases.fetchedAtDate() }}</div>
      <div v-for="release in releases.results" :key="release.url">
        <ReleaseContent :release="release" />
      </div>

      <div v-if="!releases.hasContents()" class="clickable" v-on:click="openReleaseUrl(repositorySetting)">
        There aren’t any releases.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list releases of <span class="clickable" v-on:click="openIssueUrl(repositorySetting)">{{ repositorySetting.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly, ref } from 'vue'
import { Account, GitHubUrl, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey, GitHubRepositoryUseCaseFactoryKey } from '@/di/types'
import { getters as queryOption } from '@/store/queryOption'
import { getters, mutations } from '@/store/releases'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'

type PropsType = {
  account: Account;
  repositorySetting: RepositorySetting;
}

export default defineComponent({
  name: 'GitHubRelease',
  components: {
    ReleaseContent
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
    const openReleaseUrl = (val: RepositorySetting) => webBrowserUserCase.openUrl(`${val.getUrl()}/releases`)

    const account = readonly(props.account)
    const githubUrl = account.githubUrl as GitHubUrl
    const accessToken = account.personalAccessToken
    const githubRepositoryUseCase = githubRepositoryUseCaseFactory.newGitHubRepositoryUseCase(githubUrl, accessToken)

    const isFailed = ref(false)
    const onSuccess = (v: Releases) => {
      isFailed.value = false
      mutations.replace(v)
    }
    const onFailure = (e: Error) => {
      // TODO: log
      console.error(e)
      isFailed.value = true
    }
    const getReleases = (): void => {
      const { repositorySetting } = props
      const option = queryOption.releases()
      githubRepositoryUseCase.getReleases(repositorySetting, option)
        .then(onSuccess)
        .catch(onFailure)
    }
    const releases = computed(() => getters.of(props.repositorySetting))

    return {
      getReleases,
      isFailed,
      openRepositorySetting,
      openReleaseUrl,
      releases
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app.scss';
@use '@/assets/contents.scss';
@use '@/assets/form.scss';
</style>
