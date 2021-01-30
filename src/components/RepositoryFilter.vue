<template>
  <input v-model="filterText" :placeholder="placeholder" class="form-input" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

export default defineComponent({
  name: 'RepositoryFilter',
  props: {
    placeholder: {
      type: String,
      requred: false,
      default: 'filter repositories'
    }
  },
  setup () {
    const filterText = ref('')
    const isVisible = (repository: RepositorySetting) =>
      repository.displayName().includes(filterText.value)

    return {
      filterText,
      isVisible
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.form-input {
  @include app.base-input-form;
  width: 40%;
}
</style>
