<template>
  <div class="spacer" />
  <span>
    <span class="text-strong">Repositories</span>
    <i v-if="!editing" class="fas fa-edit clickable" v-on:click="emitEdit(true)"></i>
    <i v-if="editing" class="fas fa-save clickable" v-on:click="emitEdit(false)"></i>
  </span>
  <div class="spacer" />
  <draggable
    :list="repositorySettings"
    :disabled="!editing"
    :item-key="key => key.displayName()"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <div>
        <i class="fas fa-times delete-button" v-if="editing" v-on:click="emitDelete(element)"></i>
        <span>
          <GitHubRepository :editing="editing" :repositorySetting="element" />
        </span>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent, SetupContext, PropType } from 'vue'
import draggable from 'vuedraggable'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepository from '@/views/settings/GitHubRepository.vue'

export default defineComponent({
  name: 'GitHubRepositories',
  components: {
    draggable,
    GitHubRepository
  },
  emits: ['edit', 'deleteRepository'],
  props: {
    editing: {
      type: Boolean,
      requred: true
    },
    repositorySettings: {
      type: Array as PropType<RepositorySetting[]>,
      required: true
    }
  },
  setup (_, context: SetupContext) {
    const emitDelete = (repository: RepositorySetting) => context.emit('deleteRepository', repository)
    const emitEdit = (editing: boolean) => context.emit('edit', editing)

    return {
      emitDelete,
      emitEdit
    }
  }
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
