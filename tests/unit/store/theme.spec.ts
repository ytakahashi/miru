import { getTheme, mutations } from '@/store/theme'

describe('theme store', () => {
  it('stores theme', () => {
    expect(getTheme()).toBe('dark')

    mutations.set('light')
    expect(getTheme()).toBe('light')
  })
})
