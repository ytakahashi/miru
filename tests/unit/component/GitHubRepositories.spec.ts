import { mount } from '@vue/test-utils'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import GitHubRepositories from '@/components/GitHubRepositories.vue'

const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

describe('GitHubRepositories.vue', () => {
  it('renders when not editing', () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        editing: false,
        repositorySettings: [setting]
      },
      global: {
        stubs: ['GitHubRepository']
      }
    })
    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-save').exists()).toBe(false)
    expect(wrapper.find('i.fa-times').exists()).toBe(false)

    wrapper.find('i.fa-edit').trigger('click')
    const editEvent = wrapper.emitted('edit')
    expect(editEvent).toHaveLength(1)
    expect(editEvent[0]).toEqual([true])
  })

  it('renders when editing', () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        editing: true,
        repositorySettings: [setting]
      },
      global: {
        stubs: ['GitHubRepository']
      }
    })
    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)

    wrapper.find('i.delete-button').trigger('click')
    const deleteEvent = wrapper.emitted('deleteRepository')
    expect(deleteEvent).toHaveLength(1)
    expect(deleteEvent[0]).toEqual([setting])

    wrapper.find('i.fa-save').trigger('click')
    const editEvent = wrapper.emitted('edit')
    expect(editEvent).toHaveLength(1)
    expect(editEvent[0]).toEqual([false])
  })
})
