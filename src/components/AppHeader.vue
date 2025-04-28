<template>
  <div id="nav">
    <router-link to="/" class="link">Settings</router-link>
    <span class="separator">|</span>
    <router-link to="/commits" class="link">Commits</router-link>
    <span class="separator">|</span>
    <router-link to="/issues" class="link">Issues</router-link>
    <span class="separator">|</span>
    <router-link to="/pulls" class="link">Pull Requests</router-link>
    <span class="separator">|</span>
    <router-link to="/releases" class="link">Releases</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const shortcut = new Map([
  ['c', '/commits'],
  ['i', '/issues'],
  ['p', '/pulls'],
  ['r', '/releases'],
  ['s', '/'],
])

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const keyHandler = async (event: KeyboardEvent): Promise<void> => {
      if (!event.ctrlKey) {
        return
      }
      const path = shortcut.get(event.key)
      if (path !== undefined && path !== route.path) {
        await router.push(path)
      }
    }

    onMounted(() => document.addEventListener('keydown', keyHandler))
    onUnmounted(() => document.removeEventListener('keydown', keyHandler))
  },
})
</script>

<style lang="scss">
#nav {
  padding: 20px;

  a {
    color: var(--main-font-color);
    text-decoration: none;
    font-size: 95%;

    &.router-link-exact-active {
      font-weight: bold;
      font-size: 130%;
    }
  }

  .separator {
    padding: 0px 10px;
  }
}

.link {
  position: relative;
  outline: 0 none;

  &::before {
    content: '';
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &::before,
  &::after {
    position: absolute;
    width: 100%;
    height: 1px;
    top: 100%;
    background: currentColor;
    pointer-events: none;
  }
}
</style>
