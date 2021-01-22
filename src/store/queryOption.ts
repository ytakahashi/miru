import { reactive } from 'vue'
import { Option } from '@/usecase/githubRepository'

const issueOption = reactive<Option>({
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC'
})

const prOption = reactive<Option>({
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC'
})

export const getters = {
  issues (): Option {
    return issueOption
  },
  pullRequests (): Option {
    return prOption
  }
}

export const mutations = {
  issues (option: Option): void {
    issueOption.count = option.count
    issueOption.sortField = option.sortField
    issueOption.sortDirection = option.sortDirection
  },
  pullRequests (option: Option): void {
    prOption.count = option.count
    prOption.sortField = option.sortField
    prOption.sortDirection = option.sortDirection
  }
}
