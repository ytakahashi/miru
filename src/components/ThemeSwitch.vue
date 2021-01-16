<template>
  <div class="themeSwitch">
    <input type="checkbox" id="checkbox" v-model="isDark" />
    <label for="checkbox">
      <i class="fas fa-sun theme-symbol" v-if="!isDark"></i>
      <i class="fas fa-moon theme-symbol" v-if="isDark"></i>
    </label>
    <div id="pointer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getTheme, mutations } from '@/store/theme'

type DataType = {
  isDark: boolean;
}

export default defineComponent({
  name: 'ThemeSwitch',
  data (): DataType {
    return {
      isDark: true
    }
  },
  mounted () {
    const theme = getTheme()
    document.documentElement.setAttribute('app-theme', theme)
    this.isDark = theme === 'dark'
  },
  watch: {
    isDark: function (val: boolean) {
      const theme = val ? 'dark' : 'light'
      document.documentElement.setAttribute('app-theme', theme)
      mutations.set(theme)
    }
  }
})
</script>

<style scoped lang="scss">
$switch-width: 96px;
$button-size: 26px;

.themeSwitch {
  position: relative;
  margin: 20px auto;
  width: $switch-width;
  background: var(--main-background-color);

  label {
    cursor: pointer;
    display: block;
    box-sizing: border-box;
    height: 35px;
    border: 2px solid var(--border-color);
    border-radius: 17px;
  }

  #pointer {
    cursor: pointer;
    position: absolute;
    width: $button-size;
    height: $button-size;
    top: 4px;
    left: 5px;
    border-radius: 50%;
    background: var(--sub-background-color);
    transition: 0.2s;
  }

  input[type="checkbox"] {
    display: none;

    &:checked {
      ~ #pointer {
        transform: translateX($switch-width - $button-size * 1.5);
      }
    }
  }

  .theme-symbol {
    margin-top: 5px;
    font-size: 140%;
  }
}
</style>
