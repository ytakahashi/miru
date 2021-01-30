<template>
  <div v-if="!open" class="open-button app-font-button">
    <i class="fas fa-cog" v-on:click="open = true"></i>
  </div>
  <div v-if="open" class="list-options">
    <div class="close-button app-font-button">
      <i class="fas fa-times" v-on:click="open = false"></i>
    </div>
    <div>
      <span class="option-title">Number of items:</span>
      <select v-model.number="viewModel.itemCount" class="app-input-form number-input">
        <option v-for="i in itemCounts" v-bind:key="i">
          {{ i }}
        </option>
      </select>
    </div>
    <div>
      <span class="option-title">Sort:</span>
      <select v-model="viewModel.selectedValue" class="app-input-form sort-input">
        <option v-for="name in sortNames" v-bind:key="name">
          {{ name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch, PropType, Ref } from 'vue'
import { Option, SortDirection, SortField } from '@/application/usecase/githubRepository'
import { getters, mutations } from '@/store/queryOption'

type ViewType = 'issues' | 'pullRequests' | 'releases'

type PropsType = {
  viewType: ViewType
}

const definedCounts = [1, 3, 5, 10, 20]
const definedSorts = [
  'Newest',
  'Oldest',
  'Most commented',
  'Least commented',
  'Recently updated',
  'Least recently updated',
  'Alphabetical',
  'Reverse alphabetical'
] as const

type SortName = typeof definedSorts[number]

type NamedSort = {
  sortName: SortName;
  sortField: SortField;
  sortDirection: SortDirection;
  supportedBy: ViewType[];
}

const namedSortList: Array<NamedSort> = [
  { sortName: 'Newest', sortField: 'CREATED_AT', sortDirection: 'DESC', supportedBy: ['issues', 'pullRequests', 'releases'] },
  { sortName: 'Oldest', sortField: 'CREATED_AT', sortDirection: 'ASC', supportedBy: ['issues', 'pullRequests', 'releases'] },
  { sortName: 'Most commented', sortField: 'COMMENTS', sortDirection: 'DESC', supportedBy: ['issues', 'pullRequests'] },
  { sortName: 'Least commented', sortField: 'COMMENTS', sortDirection: 'ASC', supportedBy: ['issues', 'pullRequests'] },
  { sortName: 'Recently updated', sortField: 'UPDATED_AT', sortDirection: 'DESC', supportedBy: ['issues', 'pullRequests'] },
  { sortName: 'Least recently updated', sortField: 'UPDATED_AT', sortDirection: 'ASC', supportedBy: ['issues', 'pullRequests'] },
  { sortName: 'Alphabetical', sortField: 'NAME', sortDirection: 'ASC', supportedBy: ['releases'] },
  { sortName: 'Reverse alphabetical', sortField: 'NAME', sortDirection: 'DESC', supportedBy: ['releases'] }
]

class OptionViewModel {
  #defaultSort: NamedSort

  itemCount = ref(10)
  sortField: Ref<SortField>
  sortDirection: Ref<SortDirection>
  selectedValue: Ref<SortName>

  constructor () {
    this.#defaultSort = namedSortList[0]
    this.sortField = ref(this.#defaultSort.sortField)
    this.sortDirection = ref(this.#defaultSort.sortDirection)
    this.selectedValue = ref(this.#defaultSort.sortName)
  }

  setOption = (option: Option): void => {
    if (option.count !== undefined) {
      this.itemCount.value = option.count
    }
    if (option.sortField !== undefined) {
      this.sortField.value = option.sortField
    }
    if (option.sortDirection !== undefined) {
      this.sortDirection.value = option.sortDirection
    }
    this.selectedValue.value = this.getDisplayName()
  }

  getDisplayName = (): SortName => {
    const found = namedSortList
      .filter(v => v.sortField === this.sortField.value)
      .find(v => v.sortDirection === this.sortDirection.value)
    return found === undefined ? this.#defaultSort.sortName : found.sortName
  }

  getOption = (): Option => {
    const found = namedSortList
      .find(v => v.sortName === this.selectedValue.value)
    const sort = found === undefined ? this.#defaultSort : found
    return {
      count: this.itemCount.value,
      sortField: sort.sortField,
      sortDirection: sort.sortDirection
    }
  }
}

export default defineComponent({
  name: 'QueryOption',
  props: {
    viewType: {
      type: String as PropType<ViewType>,
      required: true
    }
  },
  setup (props: PropsType) {
    const viewModel = reactive(new OptionViewModel())
    const itemCounts = ref(definedCounts)
    const sortNames = ref(namedSortList.filter(v => v.supportedBy.includes(props.viewType)).map(v => v.sortName))
    const open = ref(false)

    const updateViewModel = () => {
      const { viewType } = props
      const option = getters[viewType]()
      viewModel.setOption(option)
    }

    const updateOption = () => {
      const { viewType } = props
      const newOption = viewModel.getOption()
      mutations[viewType](newOption)
      updateViewModel()
    }

    watch(viewModel, updateOption)
    onMounted(updateViewModel)

    return {
      viewModel,
      sortNames,
      itemCounts,
      open
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/form';

.list-options {
  width: 220px;
  text-align: left;
  padding: 1em;
  margin: 0 13% 20px auto;
  border: 1px solid var(--border-color);
  border-radius: 0.5em;
}

.option-title {
  margin-right: 10px;
}

.open-button {
  width: max-content;
  margin: 0 13% 10px auto;
}

.close-button {
  margin: -8px -10px 0 auto;
  width: 18px;
}

.number-input {
  width: 75px;
}

.sort-input {
  width: 167px;
}
</style>
