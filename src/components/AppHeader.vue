<template>
  <div id="nav">
    <router-link to="/">Settings</router-link>
    <span class="separator">|</span>
    <router-link to="/issues">Issues</router-link>
    <span class="separator">|</span>
    <router-link to="/pulls">Pull Requests</router-link>
    <span class="separator">|</span>
    <router-link to="/releases">Releases</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const shortcut = new Map([
  ['i', '/issues'],
  ['p', '/pulls'],
  ['r', '/releases'],
  ['s', '/']
])

export default defineComponent({
  name: 'AppHeader',
  setup () {
    const route = useRoute()
    const router = useRouter()

    const keyHandler = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        return
      }
      const path = shortcut.get(event.key)
      if (path !== undefined && path !== route.path) {
        router.push(path)
      }
    }

    onMounted(() => document.addEventListener('keydown', keyHandler))
    onUnmounted(() => document.removeEventListener('keydown', keyHandler))
  }
})
</script>

<style lang="scss">
#nav {
  padding: 20px;
  font-weight: bold;

  a {
    color: var(--link-color);

    &.router-link-exact-active {
      color: var(--link-color-active);
    }
  }

  .separator {
    padding: 0px 10px;
  }
}
</style>
