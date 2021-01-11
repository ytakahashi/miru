<template>
  <div class="issue" v-on:click="openIssue()">
    <div class="issue-update">
      <i class="far fa-clock"></i>
      {{ issue.getUpdatedRelativeDate() }}
    </div>
    <span class="issue-title">{{ issue.title }}</span>
    <div class="issue-description">
      {{ issue.authorName }} created {{ issue.getCreatedRelativeDate() }}
      <span class="issue-info">
        <i class="far fa-comments"></i> {{ issue.numberOfComments }}
        <i class="far fa-user"></i>{{ issue.numberOfParticipants }}
      </span>
    </div>
    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="issue-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { shell } from 'electron'
import { Issue } from '@/domain/model/github'

export default defineComponent({
  name: 'IssueContent',
  props: {
    issue: {
      type: Issue,
      required: true
    }
  },
  methods: {
    openIssue (): void {
      shell.openExternal(this.issue.url)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
</style>
