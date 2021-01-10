<template>
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="(repo, index) in t.repositories" :key="index">
      <GitHubPullRequest :repositoryUrl="repo" :githubRepositoryService="t.gitHubRepositoryService"></GitHubPullRequest>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GitHubPullRequest from '@/components/GitHubPullRequest.vue'
import RepositoryViewBase from '@/views/RepositoryViewBase'

export default defineComponent({
  extends: RepositoryViewBase,
  name: 'PullRequestView',
  components: {
    GitHubPullRequest
  }
})
</script>
