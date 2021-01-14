<template>
  <div class="issue-list">
    <div class="issue-list-header">
      <span class="repository-name clickable" v-on:click="openRepository()">{{ repositoryUrl.asString() }}</span>
      <button type="button" v-on:click="getIssues()">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>

    <div v-if="issues">
      <div>Last fetched: {{ issues.fetchedAtDate() }}</div>
      <div v-for="issue in issues.results" :key="issue.url">
        <IssueContent :issue="issue" />
      </div>

      <div v-if="!issues.hasContents()" class="clickable" v-on:click="openPRs()">
        There aren’t any open issues.
      </div>
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
import { Issues } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/issues'
import { GitHubRepositoryUseCase, Option } from '@/usecase/githubRepository'

type DataType = {
  isFailed: boolean;
}

export default defineComponent({
  name: 'GitHubIssue',
  components: {
    IssueContent
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
    getIssues (): void {
      const onSuccess = (i: Issues) => {
        this.isFailed = false
        mutations.replace(i)
      }
      const onFailure = (e: Error) => {
        console.error(e)
        this.isFailed = true
      }
      this.githubRepositoryUseCase.getIssues(this.repositoryUrl, this.option)
        .then(onSuccess)
        .catch(onFailure)
    },
    openRepository (): void {
      shell.openExternal(this.repositoryUrl.getUrl())
    },
    openIssues (): void {
      shell.openExternal(`${this.repositoryUrl.getUrl()}/issues`)
    }
  },
  computed: {
    issues (): Issues|undefined {
      return getters.of(this.repositoryUrl)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
</style>
