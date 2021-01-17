<template>
  <div v-if="!open" class="open-button app-font-button">
    <i class="fas fa-cog app-button" v-on:click="open = true"></i>
  </div>
  <div v-if="open" class="list-options">
    <div class="close-button app-font-button">
      <i class="fas fa-times app-button" v-on:click="open = false"></i>
    </div>
    <div>
      <span class="option-title">Number of {{ listType }}:</span>
      <select v-model.number="numberOfItems" class="app-input-form">
        <option>1</option>
        <option>3</option>
        <option>5</option>
        <option selected>10</option>
        <option>20</option>
      </select>
    </div>
    <div>
      <span class="option-title">Sort:</span>
      <select v-model="selectedValue" class="app-input-form">
        <option v-for="option in sortNames" v-bind:key="option" :selected="option === 'Recently updated'">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Option, SortDirection, SortField } from '@/usecase/githubRepository'

const resolveSort = (name: string): [SortField, SortDirection] => {
  switch (name) {
    case 'Newest':
      return ['CREATED_AT', 'DESC']
    case 'Oldest':
      return ['CREATED_AT', 'ASC']
    case 'Most commented':
      return ['COMMENTS', 'DESC']
    case 'Least commented':
      return ['COMMENTS', 'ASC']
    case 'Recently updated':
      return ['UPDATED_AT', 'DESC']
    case 'Least recently updated':
      return ['UPDATED_AT', 'ASC']
    default:
      return ['UPDATED_AT', 'DESC']
  }
}

type DataType = {
  numberOfItems: number;
  sortNames: Array<string>,
  selectedValue: string;
  open: boolean;
}

export default defineComponent({
  name: 'ListOption',
  data (): DataType {
    return {
      numberOfItems: 10,
      sortNames: ['Newest', 'Oldest', 'Most commented', 'Least commented', 'Recently updated', 'Least recently updated'],
      selectedValue: 'Recently updated',
      open: false
    }
  },
  props: {
    listType: {
      type: String,
      required: true
    }
  },
  emits: {
    updated: null
  },
  methods: {
    getOptions (): Option {
      const [field, direction] = resolveSort(this.selectedValue)
      return {
        count: this.numberOfItems,
        sortField: field,
        sortDirection: direction
      }
    }
  },
  watch: {
    numberOfItems: function () {
      this.$emit('updated')
    },
    selectedValue: function () {
      this.$emit('updated')
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/form.scss';

.list-options {
  width: 240px;
  text-align: left;
  padding: 1em;
  margin: 0 13% 20px auto;
  border: 1px solid var(--border-color);
  border-radius: 0.5em;
}

.option-title {
  margin-right: 0.5em;
}

.app-button {
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 40%;
  cursor: pointer;
}

.open-button {
  width: max-content;
  margin: 0 13% 10px auto;
}

.close-button {
  margin: -10px 0 0 auto;
  width: 18px;
}
</style>
