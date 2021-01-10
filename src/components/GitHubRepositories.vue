<template>
  <span>Respositories
    <i v-if="!editable" class="far fa-edit" v-on:click="editRepositories()"></i>
    <i v-if="editable" class="far fa-check-square" v-on:click="doneEdit()"></i>
  </span>

  <div v-for="url in repositoryUrls" :key="url.getUrl()">
    <i class="fas fa-times" v-if="editable" v-on:click="deleteRepository(url)"></i>
    <span class="clickable" v-on:click="openRepository(url)">{{ url.asString() }}</span>
  </div>
</template>

<script lang="ts">
import { shell } from 'electron'
import { defineComponent, PropType } from 'vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export default defineComponent({
  name: 'GitHubRepositories',
  emits: ['edit', 'deleteRepository'],
  props: {
    editable: {
      type: Boolean,
      requred: true
    },
    repositoryUrls: {
      type: Array as PropType<RepositoryUrl[]>,
      required: true
    }
  },
  methods: {
    editRepositories (): void {
      this.$emit('edit', true)
    },
    doneEdit (): void {
      this.$emit('edit', false)
    },
    deleteRepository (url: RepositoryUrl): void {
      this.$emit('deleteRepository', url)
    },
    openRepository (url: RepositoryUrl): void {
      shell.openExternal(url.getUrl())
    }
  }
})
</script>

<style scoped lang="scss">
.clickable {
  cursor: pointer;
}
</style>
