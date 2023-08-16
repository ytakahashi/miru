<template>
  <input
    ref="repositoryFilter"
    v-model="filterText"
    :placeholder="placeholder"
    class="form-input"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, Ref } from 'vue'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

export default defineComponent({
  name: 'RepositoryFilter',
  props: {
    placeholder: {
      type: String,
      requred: false,
      default: 'filter repositories',
    },
  },
  setup() {
    const filterText = ref('')
    const isVisible = (repository: RepositorySetting) =>
      repository.displayName().includes(filterText.value)

    const repositoryFilter: Ref<HTMLElement | null> = ref(null)
    const listener = (event: KeyboardEvent) => {
      if (['Key', 'Digit'].some(v => event.code.startsWith(v))) {
        repositoryFilter.value?.focus()
      }
    }
    onMounted(() => window.addEventListener('keydown', listener))
    onUnmounted(() => window.removeEventListener('keydown', listener))

    return {
      repositoryFilter,
      filterText,
      isVisible,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.form-input {
  @include app.base-input-form;
  width: 40%;
}
</style>
