<template>
  <div :class="boxStyle" v-on:click="openPullRequest()">
    <div class="pr-information">
      <span>
        <i class="fas fa-clock"></i>{{ pullRequest.getUpdatedRelativeDate() }}
        <span class="draft-mark" v-if="pullRequest.isDraft">draft</span>
      </span>
      <span>#{{ pullRequest.issueNumber }}</span>
    </div>

    <span class="content-title">
      {{ pullRequest.title }}
    </span>

    <div class="pr-description">
      <span>{{ pullRequest.authorName }} opened {{ pullRequest.getCreatedRelativeDate() }}</span>
      <span><i class="fas fa-comments"></i>{{ pullRequest.numberOfComments }}</span>
      <span><i class="fas fa-user"></i>{{ pullRequest.numberOfParticipants }}</span>
      <span><i class="fas fa-file"></i> {{ pullRequest.changedFiles }}</span>
      <span class="additions">+{{ pullRequest.additions }}</span>
      <span class="deletions">-{{ pullRequest.deletions }}</span>
    </div>

    <span v-for="(label, index) in pullRequest.labels" :key="index">
      <span class="github-label" v-bind:style="{ backgroundColor: `#${label.color}`}">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { PullRequest } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'

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

    const boxStyle = computed(() => ({
      'content-box-open': !props.pullRequest.isDraft,
      'content-box-pr-draft': props.pullRequest.isDraft
    }))

    return {
      boxStyle,
      openPullRequest
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.content-box-pr-draft {
  @include contents.content-box(var(--color-draft-pr));
}

.draft-mark {
  @include app.badge-box();
  background-color: var(--sub-background-color);
}

.additions {
  color: var(--color-diff-plus);
}

.deletions {
  color: var(--color-diff-minus);
}

.github-label {
  @include app.badge-box();
}

.github-label {
  @include app.badge-box();
}

.pr-information {
  @include contents.base-content-description(space-between);
}

.pr-description {
  @include contents.base-content-description(center);
}
</style>
