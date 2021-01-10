import { mount } from '@vue/test-utils'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { RepositoryUrl } from '@/domain/model/githubRepository'

describe('GitHubRepositories.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        editable: false,
        repositoryUrls: [new RepositoryUrl('https://github.com/ytakahashi/miru')]
      }
    })
    console.log(wrapper.html())
    // expect(wrapper.text()).toMatch(msg)
  })
})
