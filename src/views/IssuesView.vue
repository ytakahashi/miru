<template>
  <ListOption :viewType="'issues'" />
  <div v-for="(t, index) in tuples" :key="index">
    <div v-for="repositorySetting in t.repositorySettings" :key="repositorySetting.getUrl()">
      <GitHubIssue
        :account="t.account"
        :repositorySetting="repositorySetting"
      />
    </div>
  </div>
  <div v-if="!isAccountConfigured">Account is not configured.</div>
  <div v-if="isAccountConfigured && total === 0">No repositories are configured.</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue'
import GitHubIssue from '@/components/GitHubIssue.vue'
import ListOption from '@/components/ListOption.vue'
import { inject } from '@/di/injector'
import { AccountSettingUseCaseFactoryKey, ApplicationSettingUseCaseKey, RepositorySettingUseCaseFactoryKey } from '@/di/types'

import { Account } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'

type RepositoryTuple = {
  account: Account;
  repositorySettings: Array<RepositorySetting>;
}

export default defineComponent({
  name: 'IssuesView',
  components: {
    GitHubIssue,
    ListOption
  },
  setup () {
    const accountSettingUseCaseFactory = inject(AccountSettingUseCaseFactoryKey)
    const applicationSettingUseCase = inject(ApplicationSettingUseCaseKey)
    const repositorySettingUseCaseFactory = inject(RepositorySettingUseCaseFactoryKey)

    const tuples: Ref<RepositoryTuple[]> = ref([])

    const initAccounts = () => {
      const settings = applicationSettingUseCase.getSettings()
      for (const s of settings) {
        const accountSettingUseCase = accountSettingUseCaseFactory.newAccountSettingUseCase(s)
        const repositorySettingUseCase = repositorySettingUseCaseFactory.newRepositorySettingUseCase(s)
        const account = accountSettingUseCase.getAccount()
        const repositorySettings = repositorySettingUseCase.getRepositorySettings()
        tuples.value.push({
          account: account,
          repositorySettings: repositorySettings.filter(s => s.showsIssues())
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

    onMounted(initAccounts)

    return {
      isAccountConfigured,
      total,
      tuples
    }
  }
})
</script>
