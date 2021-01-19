<template>
  <ListOption ref="listOption" :listType="'issues'" @updated="updateOption" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="(repo, index) in t.repositories" :key="index">
      <GitHubIssue
        :account="t.account"
        :repositoryUrl="repo"
        :option="option"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GitHubIssue from '@/components/GitHubIssue.vue'
import RepositoryViewBase from '@/views/repositoryViewBase'

export default defineComponent({
  extends: RepositoryViewBase,
  name: 'IssuesView',
  components: {
    GitHubIssue
  }
})
</script>
