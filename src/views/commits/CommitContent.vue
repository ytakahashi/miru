<template>
  <div class="commit-box" v-on:click="openCommit()">
    <div class="commit-information" v-if="commit.pushedDate">
      <span class="tooltip" :data-tooltip="commit.getPushedLocalDate()">
        <i class="fas fa-clock"></i>{{ commit.getPushedRelativeDate() }}
      </span>
    </div>
    <div class="commit-message">{{ commit.message }}</div>
    <span class="commit-description">
      <span class="tooltip" :data-tooltip="commit.getAuthoredLocalDate()">
        {{ commit.getAuthorInformation() }},
      </span>
      <span class="tooltip" :data-tooltip="commit.getCommittedLocalDate()">
        {{ commit.getCommitInformation() }}
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Commit } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'

type PropsType = {
  commit: Commit
}

export default defineComponent({
  name: 'CommitContent',
  props: {
    commit: {
      type: Commit,
      required: true
    }
  },
  setup (props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openCommit = () => webBrowserUserCase.openUrl(props.commit.commitUrl)

    return {
      openCommit
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.commit-box {
  @include contents.content-box(var(--sub-font-color));
}

.commit-message {
  white-space: pre-wrap;
  text-align: left;
  padding-left: 20px;
  font-weight: bold;
  font-size: 95%;
  margin: 15px 0;
}

.commit-information {
  @include contents.base-content-description(space-between);
}

.commit-description {
  @include contents.base-content-description(center);
}
</style>
