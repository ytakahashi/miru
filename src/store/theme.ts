import { reactive } from 'vue'

type Theme = 'dark' | 'light'

type Store = {
  theme: Theme
}

const theme = reactive<Store>({
  theme: 'dark'
})

export const getTheme = (): string => theme.theme

export const mutations = {
  set (value: Theme): void {
    theme.theme = value
  }
}
