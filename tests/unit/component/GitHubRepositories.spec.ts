import { mount } from '@vue/test-utils'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'

const url = new RepositoryUrl('https://github.com/ytakahashi/miru')

describe('GitHubRepositories.vue', () => {
  it('renders when not editing', () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        editing: false,
        repositoryUrls: [url]
      }
    })
    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-check-square').exists()).toBe(false)
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
        repositoryUrls: [url]
      }
    })
    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-check-square').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)

    wrapper.find('i.delete-button').trigger('click')
    const deleteEvent = wrapper.emitted('deleteRepository')
    expect(deleteEvent).toHaveLength(1)
    expect(deleteEvent[0]).toEqual([url])

    wrapper.find('i.fa-check-square').trigger('click')
    const editEvent = wrapper.emitted('edit')
    expect(editEvent).toHaveLength(1)
    expect(editEvent[0]).toEqual([false])
  })
})
