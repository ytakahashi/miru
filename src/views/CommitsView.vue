<template>
  <RepositoryFilter ref="repositoryFilter" />
  <QueryOption :view-type="'commits'" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="repositorySetting in t.repositorySettings" :key="repositorySetting.getUrl()">
      <CommitHistory
        v-show="isVisible(repositorySetting)"
        :account="t.account"
        :repository-setting="repositorySetting"
      />
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
import CommitHistory from '@/views/commits/CommitHistory.vue'

type RepositoryTuple = {
  account: Account
  repositorySettings: Array<RepositorySetting>
}

export default defineComponent({
  name: 'CommitsView',
  components: {
    CommitHistory,
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

    const initAccounts = () => {
      const settings = applicationSettingUseCase.getSettings()
      for (const s of settings) {
        const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(s)
        const repositorySettingUseCase =
          repositorySettingUseCaseFactory.newRepositorySettingUseCase(s)
        const account = accountSettingUseCase.getAccount()
        const repositorySettings = repositorySettingUseCase.getRepositorySettings()
        tuples.value.push({
          account,
          repositorySettings: repositorySettings.filter(s => s.showsCommits()),
        })
      }
    }

    const total = computed(() =>
      tuples.value
        .map(v => v.repositorySettings)
        .map(v => v.length)
        .reduce((a, b) => a + b, 0)
    )

    const isAccountConfigured = computed(() => tuples.value.length !== 0)

    const isVisible = (repository: RepositorySetting) =>
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
