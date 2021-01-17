<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepository()">{{ repositoryUrl.asString() }}</span>
      <button type="button" class="app-input-button" v-on:click="getPullRequests()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="pullRequests">
      <div class="last-fetched-date">Last fetched: {{ pullRequests.fetchedAtDate() }}</div>
      <div v-for="pr in pullRequests.results" :key="pr.url">
        <PullRequestContent :pullRequest="pr" />
      </div>

      <div v-if="!pullRequests.hasContents()" class="clickable" v-on:click="openPRs()">
        There aren’t any open pull requests.
      </div>
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of <span class="clickable" v-on:click="openPRs()">{{ repositoryUrl.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { shell } from 'electron'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/pullRequests'
import { GitHubRepositoryUseCase, Option } from '@/usecase/githubRepository'

type DataType = {
  isFailed: boolean;
}

export default defineComponent({
  name: 'GitHubPullRequest',
  components: {
    PullRequestContent
  },
  data (): DataType {
    return {
      isFailed: false
    }
  },
  props: {
    repositoryUrl: {
      type: RepositoryUrl,
      required: true
    },
    githubRepositoryUseCase: {
      type: Object as PropType<GitHubRepositoryUseCase>,
      required: true
    },
    option: {
      type: Object as PropType<Option>,
      required: true
    }
  },
  methods: {
    getPullRequests (): void {
      const onSuccess = (prs: PullRequests) => {
        this.isFailed = false
        mutations.replace(prs)
      }
      const onFailure = (e: Error) => {
        console.error(e)
        this.isFailed = true
      }
      this.githubRepositoryUseCase.getPullRequests(this.repositoryUrl, this.option)
        .then(onSuccess)
        .catch(onFailure)
    },
    openRepository (): void {
      shell.openExternal(this.repositoryUrl.getUrl())
    },
    openPRs (): void {
      shell.openExternal(`${this.repositoryUrl.getUrl()}/pulls`)
    }
  },
  computed: {
    pullRequests (): PullRequests|undefined {
      return getters.of(this.repositoryUrl)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/form.scss';
</style>
