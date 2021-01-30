<template>
  <span :class="editing ? 'draggable' : 'clickable'"  v-on:click="openRepository()">
    {{ repositorySetting.displayName() }}
  </span>

  <span v-if="editing" class="preference-input-block">
    <span class="preference-input clickable" v-on:click="toggleIssuePreference()">
      <i class="fas fa-square" v-if="!showsIssues"></i>
      <i class="fas fa-check-square" v-if="showsIssues"></i>
      <span class="margin-left">Issue</span>
    </span>

    <span class="preference-input clickable" v-on:click="togglePullRequestPreference()">
      <i class="fas fa-square" v-if="!showsPullRequests"></i>
      <i class="fas fa-check-square" v-if="showsPullRequests"></i>
      <span class="margin-left">PR</span>
    </span>

    <span class="preference-input clickable" v-on:click="toggleReleasePreference()">
      <i class="fas fa-square" v-if="!showsReleases"></i>
      <i class="fas fa-check-square" v-if="showsReleases"></i>
      <span class="margin-left">Release</span>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey } from '@/di/types'

type PropsType = {
  editing: boolean;
  repositorySetting: RepositorySetting;
}

export default defineComponent({
  name: 'GitHubRepository',
  props: {
    editing: {
      type: Boolean,
      requred: true
    },
    repositorySetting: {
      type: RepositorySetting,
      required: true
    }
  },
  setup (props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openRepository = () => {
      if (props.editing) {
        return
      }
      webBrowserUserCase.openUrl(props.repositorySetting.getUrl())
    }

    const showsIssues = ref(props.repositorySetting.showsIssues())
    watch(showsIssues, (next: boolean) => props.repositorySetting.setIssuePreference(next))
    const toggleIssuePreference = () => (showsIssues.value = !showsIssues.value)

    const showsPullRequests = ref(props.repositorySetting.showsPullRequests())
    watch(showsPullRequests, (next: boolean) => props.repositorySetting.setPullRequestPreference(next))
    const togglePullRequestPreference = () => (showsPullRequests.value = !showsPullRequests.value)

    const showsReleases = ref(props.repositorySetting.showsReleases())
    watch(showsReleases, (next: boolean) => props.repositorySetting.setReleasePreference(next))
    const toggleReleasePreference = () => (showsReleases.value = !showsReleases.value)

    return {
      openRepository,
      showsIssues,
      toggleIssuePreference,
      showsPullRequests,
      togglePullRequestPreference,
      showsReleases,
      toggleReleasePreference
    }
  }
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
