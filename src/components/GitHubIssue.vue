<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepository()">{{ repositoryUrl.asString() }}</span>
      <button type="button" v-on:click="getIssues()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-for="issue in issues" :key="issue.url">
      <IssueContent :issue="issue" />
    </div>

    <div v-if="isEmpty" class="clickable" v-on:click="openIssues()">
      There aren’t any open issues.
    </div>

    <div v-if="isFailed">
      Failed to list issues of <span class="clickable" v-on:click="openIssues()">{{ repositoryUrl.getUrl() }}</span>.<br />
      The repository does not exist or not visible with provided pesonal access token.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { shell } from 'electron'
import IssueContent from '@/components/IssueContent.vue'
import { Issue, Issues } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GitHubRepositoryUseCase } from '@/usecase/githubRepository'

type DataType = {
  issues: Array<Issue>;
  isFailed: boolean;
  isEmpty: boolean;
}

export default defineComponent({
  name: 'GitHubIssue',
  components: {
    IssueContent
  },
  data (): DataType {
    return {
      issues: [],
      isFailed: false,
      isEmpty: false
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
    }
  },
  methods: {
    getIssues (): void {
      const onSuccess = (i: Issues) => {
        this.isFailed = false
        this.issues = i.issues
        this.isEmpty = i.issues.length === 0
      }
      const onFailure = (e: Error) => {
        console.error(e)
        this.isFailed = true
      }
      this.githubRepositoryUseCase.getIssues(this.repositoryUrl)
        .then(onSuccess)
        .catch(onFailure)
    },
    openRepository (): void {
      shell.openExternal(this.repositoryUrl.getUrl())
    },
    openIssues (): void {
      shell.openExternal(`${this.repositoryUrl.getUrl()}/issues`)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
</style>
