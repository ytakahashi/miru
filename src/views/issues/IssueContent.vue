<template>
  <div class="content-box-open" v-on:click="openIssue()">
    <div class="issue-information">
      <span><i class="fas fa-clock"></i>{{ issue.getUpdatedRelativeDate() }}      </span>
      <span>#{{ issue.issueNumber }}</span>
    </div>

    <span class="content-title">
      {{ issue.title }}
    </span>

    <div class="issue-description">
      <span>{{ issue.authorName }} opened {{ issue.getCreatedRelativeDate() }}</span>
      <span><i class="fas fa-comments"></i>{{ issue.numberOfComments }}</span>
      <span><i class="fas fa-user"></i>{{ issue.numberOfParticipants }}</span>
    </div>

    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="github-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Issue } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'

type PropsType = {
  issue: Issue
}

export default defineComponent({
  name: 'IssueContent',
  props: {
    issue: {
      type: Issue,
      required: true
    }
  },
  setup (props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openIssue = () => webBrowserUserCase.openUrl(props.issue.url)

    return {
      openIssue
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.github-label {
  @include app.badge-box();
}

.issue-information {
  @include contents.base-content-description(space-between);
}

.issue-description {
  @include contents.base-content-description(center);
}
</style>