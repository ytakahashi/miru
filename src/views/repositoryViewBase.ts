import { defineComponent, PropType } from 'vue'
import ListOption from '@/components/ListOption.vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { Option } from '@/usecase/githubRepository'
import { Account } from '@/domain/model/github'

type RepositoryTuple = {
  account: Account;
  repositories: Array<RepositoryUrl>;
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
    }
  },
  data (): DataType {
    return {
      option: {},
      tuples: []
    }
  },
  methods: {
    updateOption (): void {
      this.option = (this.$refs.listOption as typeof ListOption).getOptions()
    }
  },
  mounted () {
    const settings = this.applicationSettingUseCase.getSettings()
    for (const s of settings) {
      const accountSettingUseCase = this.accountSettingUseCaseFactory.newAccountSettingUseCase(s)
      const account = accountSettingUseCase.getAccount()
      const repositoryUrls = accountSettingUseCase.getRepositoryUrls()
      this.tuples.push({
        account: account,
        repositories: repositoryUrls
      })
    }
  }
})