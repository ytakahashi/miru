import { mount } from '@vue/test-utils'
import RepositoryFilter from '@/components/RepositoryFilter.vue'
import { RepositorySetting } from '@/domain/model/githubRepository'

const setting = new RepositorySetting('https://github.com/foo/bar')

describe('RepositoryFilter.vue', () => {
  describe('isVisible', () => {
    it('returns true by default', async () => {
      const wrapper = mount(RepositoryFilter)

      expect(wrapper.vm.isVisible(setting)).toBe(true)
    })

    it('returns true', async () => {
      const wrapper = mount(RepositoryFilter)

      await wrapper.find('input').setValue('bar')
      expect(wrapper.vm.isVisible(setting)).toBe(true)
    })

    it('returns false', async () => {
      const wrapper = mount(RepositoryFilter)

      await wrapper.find('input').setValue('baz')
      expect(wrapper.vm.isVisible(setting)).toBe(false)
    })
  })
})
