<template>
  <div :class="boxStyle" @click="openPullRequest()">
    <div class="pr-information">
      <span>
        <span class="tooltip" :data-tooltip="pullRequest.getUpdatedLocalDate()">
          <i class="fas fa-clock"></i>{{ pullRequest.getUpdatedRelativeDate() }}
        </span>
        <span v-if="pullRequest.isDraft" class="draft-mark">Draft</span>
      </span>
      <span>#{{ pullRequest.issueNumber }}</span>
    </div>
    <div class="pr-information">
      <span v-if="pullRequest.viewerDidAuthor" class="info-badge">My PR</span>
      <span v-else />
      <span>
        <span v-if="pullRequest.isAssigned" class="info-badge">Assigned</span>
        <span v-if="pullRequest.isReviewRequested" class="info-badge">Review Requested</span>
      </span>
    </div>

    <span class="content-title">
      {{ pullRequest.title }}
    </span>

    <div class="pr-description">
      <span>
        {{ pullRequest.authorName }} opened
        <span class="tooltip" :data-tooltip="pullRequest.getCreatedLocalDate()">{{
          pullRequest.getCreatedRelativeDate()
        }}</span>
      </span>
      <span class="tooltip" :data-tooltip="conversationDetail"
        ><i class="fas fa-comments"></i>{{ conversationCount }}</span
      >
      <span><i class="fas fa-user"></i>{{ pullRequest.numberOfParticipants }}</span>
      <span><i class="fas fa-file"></i> {{ pullRequest.changedFiles }}</span>
      <span class="additions">+{{ pullRequest.additions }}</span>
      <span class="deletions">-{{ pullRequest.deletions }}</span>
    </div>

    <span v-for="(label, index) in pullRequest.labels" :key="index">
      <span class="github-label" :style="getLabelColor(label)">{{ label.name }}</span>
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
      required: true,
    },
  },
  setup(props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openPullRequest = () => webBrowserUserCase.openUrl(props.pullRequest.url)

    const boxStyle = computed(() => {
      const { pullRequest } = props
      const state = props.pullRequest.state
      return state === 'OPEN'
        ? pullRequest.isDraft
          ? 'content-box-pr-draft'
          : 'content-box-open'
        : `content-box-pr-${state.toLowerCase()}`
    })

    const getLabelColor = (label: Label) => ({
      color: label.isLight ? '#2e2d2d' : '#fdfdfd',
      backgroundColor: label.color,
    })

    const conversationCount = computed(() => {
      const count = (
        props.pullRequest.numberOfComments + props.pullRequest.reviews.reviewCount
      ).toString()
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
      conversationDetail,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.content-box-pr-merged {
  @include contents.content-box(var(--color-merged-pr));
}

.content-box-pr-closed {
  @include contents.content-box(var(--color-closed-pr));
}

.content-box-pr-draft {
  @include contents.content-box(var(--color-draft-pr));
}

.draft-mark {
  @include app.badge-box();
}

.info-badge {
  @include app.badge-box(var(--notice-color), var(--notice-color));
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
