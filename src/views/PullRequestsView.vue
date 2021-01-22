<template>
  <ListOption :viewType="'pullRequests'" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="repositorySetting in t.repositorySettings" :key="repositorySetting.getUrl()">
      <GitHubPullRequest
        :account="t.account"
        :repositorySetting="repositorySetting"
      />
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
