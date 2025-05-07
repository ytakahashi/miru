<template>
  <span :class="editing ? 'draggable' : 'clickable'" @click="openRepository()">
    {{ repositorySetting.displayName() }}
  </span>

  <span :class="editing ? 'clickable' : 'default-cursor'" @click="toggleEditCategory()">
    ({{ repositorySetting.getCategory() }})
  </span>

  <div v-if="isEditingCategory" class="block">
    <input v-model="category" class="category-input" />
    <button class="add-category-button" @click="updateCategory()">
      <i class="far fa-save"></i>
    </button>
    <button class="cancel-category-edit-button" @click="updateCategory()">
      <i class="far fa-times-circle"></i>
    </button>
  </div>
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
    const openRepository = (): void => {
      if (props.editing) {
        return
      }
      webBrowserUserCase.openUrl(props.repositorySetting.getUrl())
    }

    const isEditingCategory = ref(false)
    const category = ref(props.repositorySetting.getCategory())
    const toggleEditCategory = (): void => {
      if (!props.editing) {
        return
      }
      isEditingCategory.value = !isEditingCategory.value
    }
    const updateCategory = (): void => {
      props.repositorySetting.setCategory(category.value)
      isEditingCategory.value = false
    }
    watch(
      () => props.editing,
      () => (isEditingCategory.value = false)
    )

    const showsCommits = ref(props.repositorySetting.showsCommits())
    watch(showsCommits, (next: boolean) => props.repositorySetting.setCommitPreference(next))
    const toggleCommitPreference = (): void => {
      showsCommits.value = !showsCommits.value
    }

    const showsIssues = ref(props.repositorySetting.showsIssues())
    watch(showsIssues, (next: boolean) => props.repositorySetting.setIssuePreference(next))
    const toggleIssuePreference = (): void => {
      showsIssues.value = !showsIssues.value
    }

    const showsPullRequests = ref(props.repositorySetting.showsPullRequests())
    watch(showsPullRequests, (next: boolean) =>
      props.repositorySetting.setPullRequestPreference(next)
    )
    const togglePullRequestPreference = (): void => {
      showsPullRequests.value = !showsPullRequests.value
    }

    const showsReleases = ref(props.repositorySetting.showsReleases())
    watch(showsReleases, (next: boolean) => props.repositorySetting.setReleasePreference(next))
    const toggleReleasePreference = (): void => {
      showsReleases.value = !showsReleases.value
    }

    return {
      openRepository,
      isEditingCategory,
      category,
      toggleEditCategory,
      updateCategory,
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

.default-cursor {
  cursor: default;
}

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

.category-input {
  @include app.base-input-form();
  & {
    width: 25%;
    margin-right: 3px;
  }
}

.add-category-button {
  @include app.base-button(10px);
  border-color: var(--main-background-color);
  & {
    font-size: 100%;
    padding-top: 5px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 0px;
  }
  &:hover {
    color: var(--main-font-color);
    background-color: var(--main-background-color);
  }
}

.cancel-category-edit-button {
  @include app.base-button(10px);
  border-color: var(--main-background-color);
  & {
    font-size: 100%;
    padding-top: 5px;
    padding-bottom: 10px;
    padding-left: 5px;
  }
  &:hover {
    color: var(--main-font-color);
    background-color: var(--main-background-color);
  }
}
</style>
