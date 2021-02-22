<template>
  <div :class="boxStyle" v-on:click="openPullRequest()">
    <div class="pr-information">
      <span>
        <span class="tooltip" :data-tooltip="pullRequest.getUpdatedLocalDate()">
          <i class="fas fa-clock"></i>{{ pullRequest.getUpdatedRelativeDate() }}
        </span>
        <span class="draft-mark" v-if="pullRequest.isDraft">Draft</span>
      </span>
      <span>#{{ pullRequest.issueNumber }}</span>
    </div>

    <span class="content-title">
      {{ pullRequest.title }}
    </span>

    <div class="pr-description">
      <span>
        {{ pullRequest.authorName }} opened <span class="tooltip" :data-tooltip="pullRequest.getCreatedLocalDate()">{{ pullRequest.getCreatedRelativeDate() }}</span>
      </span>
      <span class="tooltip" :data-tooltip="conversationDetail"><i class="fas fa-comments"></i>{{ conversationCount }}</span>
      <span><i class="fas fa-user"></i>{{ pullRequest.numberOfParticipants }}</span>
      <span><i class="fas fa-file"></i> {{ pullRequest.changedFiles }}</span>
      <span class="additions">+{{ pullRequest.additions }}</span>
      <span class="deletions">-{{ pullRequest.deletions }}</span>
    </div>

    <span v-for="(label, index) in pullRequest.labels" :key="index">
      <span class="github-label" v-bind:style="getLabelColor(label)">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Label, PullRequest } from '@/application/domain/model/github'
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
    const getLabelColor = (label: Label) => ({
      color: label.isLight ? '#2e2d2d' : '#fdfdfd',
      backgroundColor: label.color
    })

    const conversationCount = computed(() => {
      const count = (props.pullRequest.numberOfComments + props.pullRequest.reviews.reviewCount).toString()
      return props.pullRequest.reviews.hasRemainedItem ? count + '+' : count
    })

    const conversationDetail = computed(() => {
      const reviews = props.pullRequest.reviews.hasRemainedItem
        ? props.pullRequest.reviews.reviewCount.toString() + '+'
        : props.pullRequest.reviews.reviewCount.toString()
      return `${props.pullRequest.numberOfComments} comments, ${reviews} reviews`
    })

    return {
      boxStyle,
      openPullRequest,
      getLabelColor,
      conversationCount,
      conversationDetail
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
}

.additions {
  color: var(--color-diff-plus);
}

.deletions {
  color: var(--color-diff-minus);
}

.github-label {
  @include app.badge-box();
  display: inline-block;
}

.pr-information {
  @include contents.base-content-description(space-between);
}

.pr-description {
  @include contents.base-content-description(center);
}
</style>
