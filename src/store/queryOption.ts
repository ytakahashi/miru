import { Option } from '@/application/usecase/githubRepository'
import { reactive } from 'vue'

const commitOption = reactive<Option>({
  count: 5,
})

const issueOption = reactive<Option>({
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC',
  states: ['OPEN'],
})

const prOption = reactive<Option>({
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC',
  states: ['OPEN'],
})

const releaseOption = reactive<Option>({
  count: 3,
  sortField: 'CREATED_AT',
  sortDirection: 'DESC',
})

export const getters = {
  commits(): Option {
    return commitOption
  },
  issues(): Option {
    return issueOption
  },
  pullRequests(): Option {
    return prOption
  },
  releases(): Option {
    return releaseOption
  },
}

export const mutations = {
  commits(option: Option): void {
    commitOption.count = option.count
  },
  issues(option: Option): void {
    issueOption.count = option.count
    issueOption.sortField = option.sortField
    issueOption.sortDirection = option.sortDirection
    issueOption.states = option.states
  },
  pullRequests(option: Option): void {
    prOption.count = option.count
    prOption.sortField = option.sortField
    prOption.sortDirection = option.sortDirection
    prOption.states = option.states
  },
  releases(option: Option): void {
    releaseOption.count = option.count
    releaseOption.sortField = option.sortField
    releaseOption.sortDirection = option.sortDirection
  },
}
