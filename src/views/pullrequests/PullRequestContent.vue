<template>
  <div :class="boxStyle" v-on:click="openPullRequest()">
    <div class="text-tiny align-left padding-bottom">
      <i class="fas fa-clock"></i>
      {{ pullRequest.getUpdatedRelativeDate() }}
      <span class="draft-mark" v-if="pullRequest.isDraft">draft</span>
    </div>
    <span class="text-strong">{{ pullRequest.title }}</span>
    <div class="text-small padding-bottom">
      {{ pullRequest.authorName }} opened {{ pullRequest.getCreatedRelativeDate() }}
      <span class="text-small">
        <span class="info-icon"><i class="fas fa-comments"></i> {{ pullRequest.numberOfComments }}</span>
        <span class="info-icon"><i class="fas fa-user"></i> {{ pullRequest.numberOfParticipants }}</span>
        <span class="info-icon"><i class="fas fa-file"></i> {{ pullRequest.changedFiles }}</span>
        <span class="additions">+{{ pullRequest.additions }}</span>
        <span class="deletions">-{{ pullRequest.deletions }}</span>
      </span>
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

@mixin content-box($text-color) {
  margin-left: 8px;
  color: $text-color;
}

.info-icon {
  @include content-box(var(--main-font-color));
}

.additions {
  @include content-box(var(--color-diff-plus));
}

.deletions{
  @include content-box(var(--color-diff-minus));
}

.github-label {
  @include app.badge-box();
}
</style>
