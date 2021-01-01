<template>
  <h3>{{ displayUrl }}</h3>
  <button v-on:click="getIssues()">list issues</button>

  <div v-for="issue in issues" :key="issue.url">
    <IssueContent :issue="issue" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IssueContent, { Issue, Label } from '@/components/IssueContent.vue'
import { GitHubRepositoryService } from '@/domain/githubRepositoryService'
import { RepositoryUrl } from '@/model/githubRepository'

type DataType = {
  issues: Array<Issue>;
}

export default defineComponent({
  name: 'GitHubIssue',
  components: {
    IssueContent
  },
  data (): DataType {
    return {
      issues: []
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
      const issues = await this.githubRepositoryService.getIssues(this.repositoryUrl)
      if (issues === undefined) {
        return
      }
      console.log('issues: ', issues)
      this.issues = issues.repository.issues.edges
        .map(v => v.node)
        .map(v => new Issue(v.title, v.url, v.createdAt, v.updatedAt, v.labels.edges.map(l => new Label(l.node.name, l.node.color))))
    }
  },
  computed: {
    displayUrl (): string {
      return `${this.repositoryUrl.getOwner()}/${this.repositoryUrl.getName()} (${this.repositoryUrl.getUrl()})`
    }
  }
})
</script>
