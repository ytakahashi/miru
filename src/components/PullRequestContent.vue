<template>
  <div class="issue" v-on:click="openPullRequest()">
    <div class="issue-update">
      <i class="far fa-clock"></i>
      {{ pullRequest.getUpdatedRelativeDate() }}
    </div>
    <span class="issue-title">{{ pullRequest.title }}</span>
    <div class="issue-description">
      {{ pullRequest.authorName }} created {{ pullRequest.getCreatedRelativeDate() }}
      <span class="issue-info">
        <i class="far fa-comments"></i> {{ pullRequest.numberOfComments }}
        <i class="far fa-user"></i>{{ pullRequest.numberOfParticipants }}
      </span>
    </div>
    <span v-for="(label, index) in pullRequest.labels" :key="index">
      <span class="issue-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { shell } from 'electron'
import { PullRequest } from '@/domain/model/github'

export default defineComponent({
  name: 'PullRequestContent',
  props: {
    pullRequest: {
      type: PullRequest,
      required: true
    }
  },
  methods: {
    openPullRequest (): void {
      shell.openExternal(this.pullRequest.url)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
</style>
