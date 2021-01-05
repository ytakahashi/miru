<template>
  {{ repositoryUrl.asString() }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RepositoryUrl } from '@/model/githubRepository'

export default defineComponent({
  name: 'GitHubRepository',
  props: {
    repositoryUrl: {
      type: Object as PropType<RepositoryUrl>,
      required: true
    }
  }
})
</script>
