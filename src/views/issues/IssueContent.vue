<template>
  <div class="content-box-open" v-on:click="openIssue()">
    <div class="issue-information">
      <span class="tooltip" :data-tooltip="issue.getUpdatedLocalDate()">
        <i class="fas fa-clock"></i>{{ issue.getUpdatedRelativeDate() }}
      </span>
      <span>#{{ issue.issueNumber }}</span>
    </div>
    <div class="issue-information">
      <span class="info-badge" v-if="issue.viewerDidAuthor">My Issue</span>
      <span v-else />
      <span class="info-badge" v-if="issue.isAssigned">Assigned</span>
    </div>
    <span class="content-title">
      {{ issue.title }}
    </span>

    <div class="issue-description">
      <span>
        {{ issue.authorName }} opened <span class="tooltip" :data-tooltip="issue.getCreatedLocalDate()">{{ issue.getCreatedRelativeDate() }}</span>
      </span>
      <span><i class="fas fa-comments"></i>{{ issue.numberOfComments }}</span>
      <span><i class="fas fa-user"></i>{{ issue.numberOfParticipants }}</span>
    </div>

    <span v-for="(label, index) in issue.labels" :key="index">
      <span class="github-label" v-bind:style="getLabelColor(label)">{{ label.name }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Issue, Label } from '@/application/domain/model/github'
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
    const getLabelColor = (label: Label) => ({
      color: label.isLight ? '#2e2d2d' : '#fdfdfd',
      backgroundColor: label.color
    })

    return {
      openIssue,
      getLabelColor
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

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
