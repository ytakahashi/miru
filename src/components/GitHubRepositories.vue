<template>
  <span>
    <span class="repositories">Respositories</span>
    <i v-if="!editing" class="far fa-edit clickable" v-on:click="emitEdit(true)"></i>
    <i v-if="editing" class="far fa-check-square clickable" v-on:click="emitEdit(false)"></i>
  </span>

  <draggable
    :list="repositorySettings"
    :disabled="!editing"
    :item-key="key => key.asString()"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <div>
        <i class="fas fa-times delete-button" v-if="editing" v-on:click="deleteRepository(element)"></i>
        <span :class="editing ? 'draggable' : 'clickable'" v-on:click="openRepository(element)">
          {{ element.asString() }}
        </span>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { shell } from 'electron'
import { defineComponent, PropType } from 'vue'
import draggable from 'vuedraggable'
import { RepositorySetting } from '@/domain/model/githubRepository'

export default defineComponent({
  name: 'GitHubRepositories',
  components: {
    draggable
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
    deleteRepository (url: RepositorySetting): void {
      this.$emit('deleteRepository', url)
    },
    openRepository (url: RepositorySetting): void {
      if (this.editing) {
        return
      }
      shell.openExternal(url.getUrl())
    }
  }
})
</script>

<style scoped lang="scss">
.clickable {
  cursor: pointer;
}

.draggable {
  cursor: grab;
}

.delete-button {
  margin-right: 5px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.repositories {
  font-weight: bold;
  margin-right: 7px;
}
</style>
