<template>
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="(repo, index) in t.repositories" :key="index">
      <GitHubPullRequest :repositoryUrl="repo" :githubRepositoryUseCase="t.githubRepositoryUseCase"></GitHubPullRequest>
    </div>
  </div>
  <div v-if="tuples.length === 0">Account is not configured.</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GitHubPullRequest from '@/components/GitHubPullRequest.vue'
import RepositoryViewBase from '@/views/repositoryViewBase'

export default defineComponent({
  extends: RepositoryViewBase,
  name: 'PullRequestView',
  components: {
    GitHubPullRequest
  }
})
</script>
