<template>
  <RepositoryFilter ref="repositoryFilter" />
  <QueryOption :view-type="'pullRequests'" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="category in t.repositoriesPerCategory.keys()" :key="category" class="category-box">
      <details open>
        <summary class="category-list-header">{{ category }}</summary>
        <div
          v-for="repositorySetting in t.repositoriesPerCategory.get(category)"
          :key="repositorySetting.getUrl()"
        >
          <GitHubPullRequest
            v-show="isVisible(repositorySetting)"
            :account="t.account"
            :repository-setting="repositorySetting"
          />
        </div>
      </details>
      <hr class="category-list-hr" />
    </div>
  </div>
  <div v-if="!isAccountConfigured">Account is not configured.</div>
  <div v-if="isAccountConfigured && total === 0">No repositories are configured.</div>

  <ScrollToTopButton />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue'
import { Account } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import QueryOption from '@/components/QueryOption.vue'
import RepositoryFilter from '@/components/RepositoryFilter.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
import { inject } from '@/plugins/di/injector'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  RepositorySettingUseCaseFactoryKey,
} from '@/plugins/di/types'
import GitHubPullRequest from '@/views/pullrequests/GitHubPullRequest.vue'

type RepositoryTuple = {
  account: Account
  repositoriesPerCategory: Map<string, Array<RepositorySetting>>
}

export default defineComponent({
  name: 'PullRequestView',
  components: {
    GitHubPullRequest,
    QueryOption,
    RepositoryFilter,
    ScrollToTopButton,
  },
  setup() {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const applicationSettingUseCase = inject(ApplicationSettingUseCaseKey)
    const repositorySettingUseCaseFactory = inject(RepositorySettingUseCaseFactoryKey)

    const tuples: Ref<RepositoryTuple[]> = ref([])
    const repositoryFilter = ref()

    const initAccounts = (): void => {
      const settings = applicationSettingUseCase.getSettings()
      for (const s of settings) {
        const repositoriesPerCategory: Map<string, Array<RepositorySetting>> = new Map()

        const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(s)
        const repositorySettingUseCase =
          repositorySettingUseCaseFactory.newRepositorySettingUseCase(s)
        const account = accountSettingUseCase.getAccount()
        const repositorySettings = repositorySettingUseCase.getRepositorySettings()
        for (const repositorySetting of repositorySettings) {
          if (!repositorySetting.showsPullRequests()) {
            continue
          }
          const category = repositorySetting.getCategory()
          if (!repositoriesPerCategory.has(category)) {
            repositoriesPerCategory.set(category, [])
          }
          repositoriesPerCategory.get(category)?.push(repositorySetting)
        }
        tuples.value.push({
          account,
          repositoriesPerCategory,
        })
      }
    }

    const total = computed(() =>
      tuples.value
        .map(v => v.repositoriesPerCategory)
        .map(v => v.size)
        .reduce((a, b) => a + b, 0)
    )

    const isAccountConfigured = computed(() => tuples.value.length !== 0)

    const isVisible = (repository: RepositorySetting): boolean =>
      (repositoryFilter.value as typeof RepositoryFilter).isVisible(repository)

    onMounted(initAccounts)

    return {
      repositoryFilter,
      isVisible,
      isAccountConfigured,
      total,
      tuples,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/category';
</style>
