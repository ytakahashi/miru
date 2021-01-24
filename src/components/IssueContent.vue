<template>
  <div class="content-box-open" v-on:click="openIssue()">
    <div class="text-tiny align-left padding-bottom">
      <i class="far fa-clock"></i>
      {{ issue.getUpdatedRelativeDate() }}
    </div>
    <span class="text-strong">{{ issue.title }}</span>
    <div class="text-small padding-bottom">
      {{ issue.authorName }} created {{ issue.getCreatedRelativeDate() }}
      <span class="text-small">
        <i class="far fa-comments"></i> {{ issue.numberOfComments }}
        <i class="far fa-user"></i>{{ issue.numberOfParticipants }}
      </span>
    </div>
    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="github-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey } from '@/di/types'
import { Issue } from '@/domain/model/github'

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
@import '@/assets/app.scss';
@import '@/assets/contents.scss';
</style>
