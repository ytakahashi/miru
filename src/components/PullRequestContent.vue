<template>
  <div class="content-box-open" v-on:click="openPullRequest()">
    <div class="text-tiny align-left padding-bottom">
      <i class="far fa-clock"></i>
      {{ pullRequest.getUpdatedRelativeDate() }}
    </div>
    <span class="text-strong">{{ pullRequest.title }}</span>
    <div class="text-small padding-bottom">
      {{ pullRequest.authorName }} created {{ pullRequest.getCreatedRelativeDate() }}
      <span class="text-small">
        <i class="far fa-comments"></i> {{ pullRequest.numberOfComments }}
        <i class="far fa-user"></i>{{ pullRequest.numberOfParticipants }}
      </span>
    </div>
    <span v-for="(label, index) in pullRequest.labels" :key="index">
      <span class="github-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey } from '@/di/types'
import { PullRequest } from '@/domain/model/github'

type PropsType = {
  pullRequest: PullRequest
}

export default defineComponent({
  name: 'PullRequestContent',
  props: {
    pullRequest: {
      type: PullRequest,
      required: true
    }
  },
  setup (props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openPullRequest = () => webBrowserUserCase.openUrl(props.pullRequest.url)

    return {
      openPullRequest
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';
@import '@/assets/contents.scss';
</style>
