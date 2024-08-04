import { mount } from '@vue/test-utils'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepositories from '@/views/settings/GitHubRepositories.vue'

const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

describe('GitHubRepositories.vue', () => {
  it('renders when not editing and start editing', async () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        repositorySettings: [setting],
      },
      global: {
        stubs: ['GitHubRepository'],
      },
    })
    wrapper.vm.showEditMenu = false

    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-save').exists()).toBe(false)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(false)
    expect(wrapper.find('i.fa-times').exists()).toBe(false)

    await wrapper.find('i.fa-edit').trigger('click')
    expect(wrapper.vm.showEditMenu).toBe(true)
    const editStartEvent = wrapper.emitted('editStart')
    if (editStartEvent === undefined) {
      expect.unreachable('editStartEvent should not be undefined')
    }
    expect(editStartEvent).toHaveLength(1)
    expect(editStartEvent[0]).toEqual([])

    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)
  })

  it('renders when editing and delete', async () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        repositorySettings: [setting],
      },
      global: {
        stubs: ['GitHubRepository'],
      },
    })
    wrapper.vm.showEditMenu = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)

    wrapper.find('i.delete-button').trigger('click')
    const deleteEvent = wrapper.emitted('deleteRepository')
    if (deleteEvent === undefined) {
      expect.unreachable('deleteEvent should not be undefined')
    }
    expect(deleteEvent).toHaveLength(1)
    expect(deleteEvent[0]).toEqual([setting])

    await wrapper.find('i.fa-save').trigger('click')
    const editCompleteEvent = wrapper.emitted('editComplete')
    if (editCompleteEvent === undefined) {
      expect.unreachable('editComplete should not be undefined')
    }
    expect(editCompleteEvent).toHaveLength(1)
    expect(editCompleteEvent[0]).toEqual([['ytakahashi/miru']])

    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-save').exists()).toBe(false)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(false)
    expect(wrapper.find('i.fa-times').exists()).toBe(false)
  })

  it('renders when cancel editing', async () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        repositorySettings: [setting],
      },
      global: {
        stubs: ['GitHubRepository'],
      },
    })
    wrapper.vm.showEditMenu = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)

    await wrapper.find('i.fa-window-close').trigger('click')
    const editCancelEvent = wrapper.emitted('editCancel')
    if (editCancelEvent === undefined) {
      expect.unreachable('editCancelEvent should not be undefined')
    }
    expect(editCancelEvent).toHaveLength(1)
    expect(editCancelEvent[0]).toEqual([])

    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-save').exists()).toBe(false)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(false)
    expect(wrapper.find('i.fa-times').exists()).toBe(false)
  })
})
