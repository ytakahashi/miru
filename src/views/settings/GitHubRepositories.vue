<template>
  <div class="spacer" />
  <span>
    <span class="text-strong">Repositories</span>
    <i v-if="!editing" class="fas fa-edit clickable" @click="emitEdit(true)"></i>
    <i v-if="editing" class="fas fa-save clickable" @click="emitEdit(false)"></i>
  </span>
  <div class="spacer" />

  <div v-for="(displayName, index) in orderedRepositories" :key="index">
    <div>
      <i
        v-if="editing"
        class="fas fa-times delete-button"
        @click="emitDelete(findSettingFrom(displayName))"
      ></i>
      <span
        :draggable="editing"
        @dragstart="() => saveFromIndex(index)"
        @drop="() => moveItem(index)"
        @dragover.prevent
      >
        <GitHubRepository :editing="editing" :repository-setting="findSettingFrom(displayName)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepository from '@/views/settings/GitHubRepository.vue'
import { PropType, Ref, SetupContext, defineComponent, ref, watch } from 'vue'

// ref. https://zenn.dev/kazuwombat/articles/f23b47f168f1d0
const moveIndex = <T,>(original: T[], from: number, to: number) => {
  const arr = [...original]
  const target = arr[from]
  arr.splice(from, 1)
  arr.splice(to, 0, target)
  return arr
}

type PropsType = {
  editing: boolean
  repositorySettings: RepositorySetting[]
}

export default defineComponent({
  name: 'GitHubRepositories',
  components: {
    GitHubRepository,
  },
  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    repositorySettings: {
      type: Array as PropType<RepositorySetting[]>,
      required: true,
    },
  },
  emits: ['edit', 'deleteRepository'],
  setup(props: PropsType, context: SetupContext) {
    const emitDelete = (repository: RepositorySetting) =>
      context.emit('deleteRepository', repository)
    const emitEdit = (editing: boolean) => context.emit('edit', editing, orderedRepositories.value)

    const orderedRepositories: Ref<string[]> = ref(
      props.repositorySettings.map(r => r.displayName())
    )
    watch(
      () => props.repositorySettings,
      () => (orderedRepositories.value = props.repositorySettings.map(r => r.displayName()))
    )

    const dragFromIndex = ref<number | null>(null)
    const saveFromIndex = (fromIndex: number) => {
      dragFromIndex.value = fromIndex
    }
    const moveItem = (targetIndex: number) => {
      if (dragFromIndex.value === null) {
        return
      }
      orderedRepositories.value = moveIndex(
        orderedRepositories.value,
        dragFromIndex.value,
        targetIndex
      )
    }

    const findSettingFrom = (displayName: string): RepositorySetting => {
      const found = props.repositorySettings.find(r => r.displayName() === displayName)
      if (found === undefined) {
        throw Error(`Unexpected : ${displayName}`)
      }
      return found
    }

    return {
      emitDelete,
      emitEdit,
      orderedRepositories,
      saveFromIndex,
      moveItem,
      findSettingFrom,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.spacer {
  padding-bottom: 5px;
}

.delete-button {
  margin-right: 5px;
}

.ghost {
  opacity: 0.5;
  background: var(--focused-color);
}
</style>
