<template>
  <AppHeader />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader
  }
})
</script>

<style lang="scss">
@use './assets/theme';

body {
  background-color: var(--main-background-color);
  color: var(--main-font-color);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
