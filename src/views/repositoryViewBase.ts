import { defineComponent, PropType } from 'vue'
import ListOption from '@/components/ListOption.vue'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { RepositorySettingUseCaseFactory } from '@/usecase/repositorySetting'
import { Option } from '@/usecase/githubRepository'
import { Account } from '@/domain/model/github'

type RepositoryTuple = {
  account: Account;
  repositorySettings: Array<RepositorySetting>;
}

type DataType = {
  option: Option;
  tuples: Array<RepositoryTuple>;
}

export default defineComponent({
  components: {
    ListOption
  },
  props: {
    accountSettingUseCaseFactory: {
      type: Object as PropType<AccountSettingUseCaseFactory>,
      required: true
    },
    applicationSettingUseCase: {
      type: Object as PropType<ApplicationSettingUseCase>,
      required: true
    },
    repositorySettingUseCaseFactory: {
      type: Object as PropType<RepositorySettingUseCaseFactory>,
      required: true
    }
  },
  data (): DataType {
    return {
      option: {},
      tuples: []
    }
  },
  mounted () {
    const settings = this.applicationSettingUseCase.getSettings()
    for (const s of settings) {
      const accountSettingUseCase = this.accountSettingUseCaseFactory.newAccountSettingUseCase(s)
      const repositorySettingUseCase = this.repositorySettingUseCaseFactory.newRepositorySettingUseCase(s)
      const account = accountSettingUseCase.getAccount()
      const repositorySettings = repositorySettingUseCase.getRepositorySettings()
      this.tuples.push({
        account: account,
        repositorySettings: repositorySettings
      })
    }
  }
})
