<template>
  <h3>{{ repositoryUrl }}</h3>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GitHubIssue',
  props: {
    repositoryUrl: String
  }
})
</script>
