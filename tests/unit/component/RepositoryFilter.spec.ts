import { mount } from '@vue/test-utils'
import RepositoryFilter from '@/components/RepositoryFilter.vue'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

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

  it('focuses input on keydown', async () => {
    const elem = document.createElement('div')
    document.body.appendChild(elem)
    const wrapper = mount(RepositoryFilter, {
      attachTo: elem
    })

    const input = wrapper.find('input').element
    expect(input).not.toBe(document.activeElement)

    await wrapper.trigger('keydown', {
      key: 'a'
    })
    expect(input).toBe(document.activeElement)
  })
})
