import { inject as i, InjectionKey } from 'vue'

export const inject = <T>(key: InjectionKey<T>): T => {
  const val = i(key)
  if (val === undefined) {
    throw new Error(`Injection Failed: ${key.toString()} is not defined`)
  }
  return val
}
