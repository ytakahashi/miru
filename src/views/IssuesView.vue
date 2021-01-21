<template>
  <ListOption ref="listOption" :listType="'issues'" @updated="updateOption" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="repositorySetting in t.repositorySettings" :key="repositorySetting.getUrl()">
      <GitHubIssue
        :account="t.account"
        :repositorySetting="repositorySetting"
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
