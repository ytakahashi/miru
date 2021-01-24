<template>
  <span>
    <span class="text-strong">Respositories</span>
    <i v-if="!editing" class="far fa-edit clickable" v-on:click="emitEdit(true)"></i>
    <i v-if="editing" class="far fa-check-square clickable" v-on:click="emitEdit(false)"></i>
  </span>

  <draggable
    :list="repositorySettings"
    :disabled="!editing"
    :item-key="key => key.displayName()"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <div>
        <i class="fas fa-times delete-button" v-if="editing" v-on:click="deleteRepository(element)"></i>
        <span>
          <GitHubRepository :editing="editing" :repositorySetting="element" />
        </span>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import draggable from 'vuedraggable'
import GitHubRepository from '@/components/GitHubRepository.vue'
import { RepositorySetting } from '@/domain/model/githubRepository'

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
  methods: {
    emitEdit (editing: boolean): void {
      this.$emit('edit', editing)
    },
    deleteRepository (repositorySetting: RepositorySetting): void {
      this.$emit('deleteRepository', repositorySetting)
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/app.scss';

.delete-button {
  margin-right: 5px;
}

.ghost {
  opacity: 0.5;
  background: var(--focused-color);
}
</style>
