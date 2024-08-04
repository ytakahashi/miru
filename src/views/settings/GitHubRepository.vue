<template>
  <span :class="editing ? 'draggable' : 'clickable'" @click="openRepository()">
    {{ repositorySetting.displayName() }}
  </span>

  <span v-if="editing" class="preference-input-block">
    <span class="preference-input clickable" @click="toggleCommitPreference()">
      <i v-if="!showsCommits" class="fas fa-square"></i>
      <i v-if="showsCommits" class="fas fa-check-square"></i>
      <span class="margin-left">Commit</span>
    </span>

    <span class="preference-input clickable" @click="toggleIssuePreference()">
      <i v-if="!showsIssues" class="fas fa-square"></i>
      <i v-if="showsIssues" class="fas fa-check-square"></i>
      <span class="margin-left">Issue</span>
    </span>

    <span class="preference-input clickable" @click="togglePullRequestPreference()">
      <i v-if="!showsPullRequests" class="fas fa-square"></i>
      <i v-if="showsPullRequests" class="fas fa-check-square"></i>
      <span class="margin-left">PR</span>
    </span>

    <span class="preference-input clickable" @click="toggleReleasePreference()">
      <i v-if="!showsReleases" class="fas fa-square"></i>
      <i v-if="showsReleases" class="fas fa-check-square"></i>
      <span class="margin-left">Release</span>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'

type PropsType = {
  editing: boolean
  repositorySetting: RepositorySetting
}

export default defineComponent({
  name: 'GitHubRepository',
  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    repositorySetting: {
      type: RepositorySetting,
      required: true,
    },
  },
  setup(props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openRepository = () => {
      if (props.editing) {
        return
      }
      webBrowserUserCase.openUrl(props.repositorySetting.getUrl())
    }

    const showsCommits = ref(props.repositorySetting.showsCommits())
    watch(showsCommits, (next: boolean) => props.repositorySetting.setCommitPreference(next))
    const toggleCommitPreference = () => (showsCommits.value = !showsCommits.value)

    const showsIssues = ref(props.repositorySetting.showsIssues())
    watch(showsIssues, (next: boolean) => props.repositorySetting.setIssuePreference(next))
    const toggleIssuePreference = () => (showsIssues.value = !showsIssues.value)

    const showsPullRequests = ref(props.repositorySetting.showsPullRequests())
    watch(showsPullRequests, (next: boolean) =>
      props.repositorySetting.setPullRequestPreference(next)
    )
    const togglePullRequestPreference = () => (showsPullRequests.value = !showsPullRequests.value)

    const showsReleases = ref(props.repositorySetting.showsReleases())
    watch(showsReleases, (next: boolean) => props.repositorySetting.setReleasePreference(next))
    const toggleReleasePreference = () => (showsReleases.value = !showsReleases.value)

    return {
      openRepository,
      showsCommits,
      toggleCommitPreference,
      showsIssues,
      toggleIssuePreference,
      showsPullRequests,
      togglePullRequestPreference,
      showsReleases,
      toggleReleasePreference,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.preference-input-block {
  display: block;
  margin-bottom: 10px;
}

.preference-input {
  margin-right: 10px;
  font-size: 90%;
}

.margin-left {
  margin-left: 5px;
}
</style>
