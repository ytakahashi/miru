<template>
  <div :class="boxStyle" @click="openIssue()">
    <div class="issue-information">
      <span class="tooltip" :data-tooltip="issue.getUpdatedLocalDate()">
        <i class="fas fa-clock"></i>{{ issue.getUpdatedRelativeDate() }}
      </span>
      <span>
        <span v-if="issue.stateReason === 'COMPLETED'" class="completed-mark">
          <i class="far fa-check-circle"></i>Closed
        </span>
        <span v-if="issue.stateReason === 'NOT_PLANNED'" class="not_planned-mark">
          <i class="fas fa-ban fa-rotate-90"></i> Closed
        </span>
        #{{ issue.issueNumber }}
      </span>
    </div>
    <div class="issue-information">
      <span v-if="issue.viewerDidAuthor" class="info-badge">My Issue</span>
      <span v-else />
      <span v-if="issue.isAssigned" class="info-badge">Assigned</span>
    </div>
    <span class="content-title">
      {{ issue.title }}
    </span>

    <div class="issue-description">
      <span>
        {{ issue.authorName }} opened
        <span class="tooltip" :data-tooltip="issue.getCreatedLocalDate()">{{
          issue.getCreatedRelativeDate()
        }}</span>
      </span>
      <span><i class="fas fa-comments"></i>{{ issue.numberOfComments }}</span>
      <span><i class="fas fa-user"></i>{{ issue.numberOfParticipants }}</span>
    </div>

    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="github-label" :style="getLabelColor(label)">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Issue, Label } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import { computed, defineComponent } from 'vue'

type PropsType = {
  issue: Issue
}

export default defineComponent({
  name: 'IssueContent',
  props: {
    issue: {
      type: Issue,
      required: true,
    },
  },
  setup(props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openIssue = () => webBrowserUserCase.openUrl(props.issue.url)

    const boxStyle = computed(() =>
      props.issue.state === 'OPEN'
        ? 'content-box-open'
        : `content-box-closed-${props.issue.stateReason?.toLowerCase()}`
    )

    const getLabelColor = (label: Label) => ({
      color: label.isLight ? '#2e2d2d' : '#fdfdfd',
      backgroundColor: label.color,
    })

    return {
      boxStyle,
      openIssue,
      getLabelColor,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.content-box-closed-completed {
  @include contents.content-box(var(--color-closed-completed-issue));
}

.content-box-closed-not_planned {
  @include contents.content-box(var(--color-closed-not_planned-issue));
}

.not_planned-mark {
  @include app.badge-box();
}

.completed-mark {
  @include app.badge-box(var(--color-closed-completed-issue), var(--color-closed-completed-issue));
}

.github-label {
  @include app.badge-box();
  display: inline-block;
}

.issue-information {
  @include contents.base-content-description(space-between);
}

.info-badge {
  @include app.badge-box(var(--notice-color), var(--notice-color));
}

.issue-description {
  @include contents.base-content-description(center);
}
</style>
