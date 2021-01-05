<template>
  <h3>{{ displayUrl }}</h3>
  <button v-on:click="getIssues()">list issues</button>

  <div v-for="issue in issues" :key="issue.url">
    <IssueContent :issue="issue" />
  </div>

  <div v-if="isEmpty">
    No issues.
  </div>

  <div v-if="isFailed">
    Failed to list issues of {{ repositoryUrl.url }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IssueContent, { Issue, Label } from '@/components/IssueContent.vue'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
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
        .map(v => new Issue(v.title, v.url, v.createdAt, v.updatedAt, v.labels.edges.map(l => new Label(l.node.name, l.node.color))))
      if (issues === undefined) {
        this.isFailed = true
      } else {
        this.isFailed = false
        this.issues = issues
        this.isEmpty = issues.length === 0
      }
    }
  },
  computed: {
    displayUrl (): string {
      return `${this.repositoryUrl.getOwner()}/${this.repositoryUrl.getName()} (${this.repositoryUrl.getUrl()})`
    }
  }
})
</script>
