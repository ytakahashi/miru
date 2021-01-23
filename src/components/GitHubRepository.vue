<template>
  <span :class="editing ? 'draggable' : 'clickable'"  v-on:click="openRepository()">
    {{ repositorySetting.displayName() }}
  </span>

  <span v-if="editing" class="preference-input-block">
    <span class="preference-input clickable" v-on:click="toggleIssuePreference()">
      <i class="far fa-square" v-if="!showsIssues"></i>
      <i class="far fa-check-square" v-if="showsIssues"></i>
      <span class="margin-left">Issue</span>
    </span>

    <span class="preference-input clickable" v-on:click="togglePullRequestPreference()">
      <i class="far fa-square" v-if="!showsPullRequests"></i>
      <i class="far fa-check-square" v-if="showsPullRequests"></i>
      <span class="margin-left">PR</span>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey } from '@/di/types'
import { RepositorySetting } from '@/domain/model/githubRepository'

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

    return {
      openRepository,
      showsIssues,
      toggleIssuePreference,
      showsPullRequests,
      togglePullRequestPreference
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';

.preference-input-block {
  display: block;
  margin-bottom: 7px;
}

.preference-input {
  margin-right: 10px;
  font-size: 90%;
}

.margin-left {
  margin-left: 5px;
}
</style>
