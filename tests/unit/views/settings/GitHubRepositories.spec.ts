import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import ModalWindow from '@/components/ModalWindow.vue'
import GitHubRepositories from '@/views/settings/GitHubRepositories.vue'

const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

// ModalWindow Mock
const ModalWindowMock = defineComponent({
  name: 'ModalWindow',
  emits: ['cancel', 'ok'],
  render: () => h('div', {}, ''),
})

describe('GitHubRepositories.vue', () => {
  it('renders when not editing and start editing', async () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        repositorySettings: [setting],
      },
      global: {
        stubs: {
          GitHubRepository: true,
          ModalWindow: ModalWindowMock,
        },
      },
    })
    wrapper.vm.showEditMenu = false

    expect(wrapper.find('i.fa-edit').exists()).toBe(true)
    expect(wrapper.find('i.fa-save').exists()).toBe(false)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(false)
    expect(wrapper.find('i.fa-times').exists()).toBe(false)
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

    await wrapper.find('i.fa-edit').trigger('click')
    expect(wrapper.vm.showEditMenu).toBe(true)
    const editStartEvent = wrapper.emitted('editStart')
    expect(editStartEvent).toBeTruthy()
    expect(editStartEvent).toHaveLength(1)
    expect(editStartEvent?.[0]).toEqual([])

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
        stubs: {
          GitHubRepository: true,
          ModalWindow: ModalWindowMock,
        },
      },
    })
    wrapper.vm.showEditMenu = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

    // When the delete button is clicked
    await wrapper.find('i.delete-button').trigger('click')
    // The confirmation modal should be displayed
    const modal = wrapper.findComponent(ModalWindow)
    expect(modal.exists()).toBe(true)

    // When the ok button is clicled
    await modal.vm.$emit('ok')

    // The deleteRepository event should be emitted
    expect(wrapper.emitted().deleteRepository).toBeTruthy()
    expect(wrapper.emitted().deleteRepository.length).toBe(1)
    expect(wrapper.emitted().deleteRepository[0]).toStrictEqual([setting])

    // The modail should be closed
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
  })

  it('renders when cancel editing', async () => {
    const wrapper = mount(GitHubRepositories, {
      props: {
        repositorySettings: [setting],
      },
      global: {
        stubs: {
          GitHubRepository: true,
          ModalWindow: ModalWindowMock,
        },
      },
    })
    wrapper.vm.showEditMenu = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-edit').exists()).toBe(false)
    expect(wrapper.find('i.fa-save').exists()).toBe(true)
    expect(wrapper.find('i.fa-window-close').exists()).toBe(true)
    expect(wrapper.find('i.fa-times').exists()).toBe(true)
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

    // When the delete button is clicked
    await wrapper.find('i.delete-button').trigger('click')
    // The confirmation modal should be displayed
    const modal = wrapper.findComponent(ModalWindow)
    expect(modal.exists()).toBe(true)

    // When the cancel button is clicled
    await modal.vm.$emit('cancel')
    // The deleteRepository event should not be emitted
    expect(wrapper.emitted().deleteRepository).toBeFalsy()
    // The modail should be closed
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
  })
})
