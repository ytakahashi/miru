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
      No issues.
    </div>

    <div v-if="isFailed" class="clickable" v-on:click="openIssues()">
      Failed to list issues of {{ repositoryUrl.getUrl() }}.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { shell } from 'electron'
import IssueContent from '@/components/IssueContent.vue'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
import { Issue, IssueLabel } from '@/model/github'
import { RepositoryUrl } from '@/model/githubRepository'

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
    githubRepositoryService: {
      type: GitHubRepositoryService,
      required: true
    }
  },
  methods: {
    async getIssues () {
      const response = await this.githubRepositoryService.getIssues(this.repositoryUrl)
      const issues = response?.repository?.issues.edges
        .map(v => v.node)
        .map(v => new Issue(v.title, v.url, v.createdAt, v.updatedAt, v.labels.edges.map(l => new IssueLabel(l.node.name, l.node.color))))
      if (issues === undefined) {
        this.isFailed = true
      } else {
        this.isFailed = false
        this.issues = issues
        this.isEmpty = issues.length === 0
      }
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
.repository-name {
  font-size: 110%;
  font-weight: bold;
  padding-left: 0.4em;
  padding-right: 0.4em;
}

.issue-list {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 1.5em;
  padding: 1em;
  position: relative;
  border: 1px solid #a9a9a9;
  border-radius: 8px;
}

.issue-list-header{
  position: absolute;
  top: -0.7em;
  background: #ffffff;
}

.clickable {
  cursor: pointer;
}
</style>
