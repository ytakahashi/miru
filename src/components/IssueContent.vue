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
.issue {
  cursor: pointer;
  padding: 0.4em 1em;
  margin: 1em 0;
  background-color: #fffbfb;
  border-left: solid 10px #ffb5b5;
}

.issue-update {
  padding-bottom: 0.5em;
  font-size: 0.8em;
  text-align: left;
}

.issue-title {
  font-size: 1.1em;
  font-weight: bold;
}

.issue-description {
  font-size: 0.9em;
}

.issue-info {
  font-size: 0.9em;
  padding-left: 0.7em;
}

.issue-label {
  border: 1px solid;
  border-radius: 7px;
  padding: 1px 8px;
  margin: 0 3px;
  font-size: 0.8em;
  font-weight: bold;
  color: #fcfcfc;
}
</style>
