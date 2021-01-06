<template>
  <div class="issue" v-on:click="openIssue()">
    <span class="issue-title">{{ issue.title }}</span><br />
    <!-- TODO: local time -->
    createdAt: {{ issue.createdAt }}, updatedAt: {{ issue.updatedAt }}
    <br />
    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="issue-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { shell } from 'electron'
import { Issue } from '@/model/github'

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
  padding: 1em;
  margin: 1em 0;
  background-color:#fffbfb;
  border-left: solid 10px #ffb5b5;
}

.issue-title {
  font-size: 1.1em;
  font-weight: bold;
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
