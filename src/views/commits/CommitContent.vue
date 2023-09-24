<template>
  <div class="commit-box" @click="openCommit()">
    <div class="commit-information">
      <span class="tooltip" :data-tooltip="commit.committedDate">
        <i class="fas fa-clock"></i>{{ commit.getCommittedRelativeDate() }}
      </span>
      <span class="tooltip" :data-tooltip="commitHash">
        <span>{{ commitHash?.slice(0, 8) }}</span>
      </span>
    </div>
    <div>
      <p class="commit-message_headline">{{ commitMessage.firstLine }}</p>
      <p class="commit-message">{{ commitMessage.other }}</p>
    </div>
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
import { Commit } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import { computed, defineComponent } from 'vue'

type PropsType = {
  commit: Commit
}

export default defineComponent({
  name: 'CommitContent',
  props: {
    commit: {
      type: Commit,
      required: true,
    },
  },
  setup(props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openCommit = () => webBrowserUserCase.openUrl(props.commit.commitUrl)

    const commitMessage = computed(() => {
      const message = props.commit.message
      const firstLine = message.split('\n', 1)[0]
      const other = message.replace(firstLine, '')
      return {
        firstLine,
        other: other.startsWith('\n') ? other.replace('\n', '') : other,
      }
    })
    const commitHash = computed(() => props.commit.commitUrl.split('/').pop())

    return {
      openCommit,
      commitMessage,
      commitHash,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.commit-box {
  @include contents.content-box(var(--color-commit));
}

.commit-message {
  white-space: pre-wrap;
  text-align: left;
  padding-left: 20px;
  font-size: 90%;
  &_headline {
    text-align: center;
    font-weight: bold;
  }
}

.commit-information {
  @include contents.base-content-description(space-between);
}

.commit-description {
  @include contents.base-content-description(center);
}
</style>
