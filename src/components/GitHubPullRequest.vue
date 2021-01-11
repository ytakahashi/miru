<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepository()">{{ repositoryUrl.asString() }}</span>
      <button type="button" v-on:click="getPullRequests()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-for="pr in pullRequests" :key="pr.url">
      <PullRequestContent :pullRequest="pr" />
    </div>

    <div v-if="isEmpty" class="clickable" v-on:click="openPRs()">
      There aren’t any open pull requests.
    </div>

    <div v-if="isFailed">
      Failed to list pull requests of <span class="clickable" v-on:click="openPRs()">{{ repositoryUrl.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { shell } from 'electron'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { PullRequest, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GitHubRepositoryService } from '@/usecase/githubRepositoryService'

type DataType = {
  pullRequests: Array<PullRequest>;
  isFailed: boolean;
  isEmpty: boolean;
}

export default defineComponent({
  name: 'GitHubPullRequest',
  components: {
    PullRequestContent
  },
  data (): DataType {
    return {
      pullRequests: [],
      isFailed: false,
      isEmpty: false
    }
  },
  props: {
    repositoryUrl: {
      type: RepositoryUrl,
      required: true
    },
    githubRepositoryService: {
      type: GitHubRepositoryService,
      required: true
    }
  },
  methods: {
    getPullRequests (): void {
      const onSuccess = (prs: PullRequests) => {
        this.isFailed = false
        this.pullRequests = prs.pullRequests
        this.isEmpty = prs.pullRequests.length === 0
      }
      const onFailure = (e: Error) => {
        console.error(e)
        this.isFailed = true
      }
      this.githubRepositoryService.getPullRequests(this.repositoryUrl)
        .then(onSuccess)
        .catch(onFailure)
    },
    openRepository (): void {
      shell.openExternal(this.repositoryUrl.getUrl())
    },
    openPRs (): void {
      shell.openExternal(`${this.repositoryUrl.getUrl()}/pulls`)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
</style>
