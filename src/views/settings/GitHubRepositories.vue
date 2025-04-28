<template>
  <div class="spacer" />
  <span>
    <span class="text-strong">Repositories</span>
    <span class="repository-edit-toggle">
      <i v-if="!showEditMenu" class="fas fa-edit clickable" @click="emitEditStart()"></i>
      <i v-if="showEditMenu" class="fas fa-save clickable" @click="emitEditComplete()"></i>
      <i v-if="showEditMenu" class="far fa-window-close clickable" @click="emitEditCancel()"></i>
    </span>
  </span>
  <div class="spacer" />

  <div v-for="(displayName, index) in orderedRepositories" :key="index">
    <div>
      <i
        v-if="showEditMenu"
        class="fas fa-times delete-button"
        @click="emitDelete(findSettingFrom(displayName))"
      ></i>
      <span
        :draggable="showEditMenu"
        @dragstart="() => saveFromIndex(index)"
        @drop="() => moveItem(index)"
        @dragover.prevent
      >
        <GitHubRepository
          :editing="showEditMenu"
          :repository-setting="findSettingFrom(displayName)"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepository from '@/views/settings/GitHubRepository.vue'
import { PropType, Ref, defineComponent, ref, watch } from 'vue'

// ref. https://zenn.dev/kazuwombat/articles/f23b47f168f1d0
const moveIndex = <T,>(original: T[], from: number, to: number): T[] => {
  const arr = [...original]
  const target = arr[from]
  arr.splice(from, 1)
  arr.splice(to, 0, target)
  return arr
}

type PropsType = {
  repositorySettings: RepositorySetting[]
}

export default defineComponent({
  name: 'GitHubRepositories',
  components: {
    GitHubRepository,
  },
  props: {
    repositorySettings: {
      type: Array as PropType<RepositorySetting[]>,
      required: true,
    },
  },
  emits: ['deleteRepository', 'editCancel', 'editComplete', 'editStart'],
  setup(props: PropsType, { emit }) {
    const showEditMenu = ref(false)

    const emitDelete = (repository: RepositorySetting): void => emit('deleteRepository', repository)
    const emitEditCancel = (): void => {
      showEditMenu.value = false
      emit('editCancel')
    }
    const emitEditComplete = (): void => {
      showEditMenu.value = false
      emit('editComplete', orderedRepositories.value)
    }
    const emitEditStart = (): void => {
      showEditMenu.value = true
      emit('editStart')
    }
    const orderedRepositories: Ref<string[]> = ref(
      props.repositorySettings.map(r => r.displayName())
    )
    watch(
      () => props.repositorySettings,
      () => (orderedRepositories.value = props.repositorySettings.map(r => r.displayName()))
    )

    const dragFromIndex = ref<number | null>(null)
    const saveFromIndex = (fromIndex: number): void => {
      dragFromIndex.value = fromIndex
    }
    const moveItem = (targetIndex: number): void => {
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
      emitEditCancel,
      emitEditComplete,
      emitEditStart,
      orderedRepositories,
      saveFromIndex,
      showEditMenu,
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

.repository-edit-toggle {
  i {
    margin-right: 5px;
  }
}
</style>
