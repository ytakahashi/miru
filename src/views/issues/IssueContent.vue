<template>
  <div class="content-box-open" v-on:click="openIssue()">
    <div class="text-tiny align-left padding-bottom">
      <i class="fas fa-clock"></i>
      {{ issue.getUpdatedRelativeDate() }}
    </div>
    <span class="text-strong">{{ issue.title }}</span>
    <div class="text-small padding-bottom">
      {{ issue.authorName }} opened {{ issue.getCreatedRelativeDate() }}
      <span class="text-small">
        <span class="info-icon"><i class="fas fa-comments"></i> {{ issue.numberOfComments }}</span>
        <span class="info-icon"><i class="fas fa-user"></i> {{ issue.numberOfParticipants }}</span>
      </span>
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

@mixin content-box($text-color) {
  margin-left: 7px;
  color: $text-color;
}

.info-icon {
  @include content-box(var(--main-font-color));
}

.github-label {
  @include app.badge-box();
}
</style>
