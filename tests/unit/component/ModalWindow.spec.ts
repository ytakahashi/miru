import { mount } from '@vue/test-utils'
import ModalWindow from '@/components/ModalWindow.vue'

describe('ModalWindow.vue', () => {
  it('renders slots content', async () => {
    const header = 'slot header test'
    const body = 'slot body test'
    const wrapper = mount(ModalWindow, {
      slots: {
        header,
        body
      }
    })
    expect(wrapper.find('.modal-header').text()).toBe(header)
    expect(wrapper.find('.modal-body').text()).toBe(body)
  })

  it('renders two buttons', async () => {
    const wrapper = mount(ModalWindow)
    expect(wrapper.findAll('.modal-button')).toHaveLength(2)
  })

  it('emits ok event', async () => {
    const wrapper = mount(ModalWindow)

    const buttons = wrapper.findAll('.modal-button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('ok')
  })

  it('emits cancel event', async () => {
    const wrapper = mount(ModalWindow)

    const buttons = wrapper.findAll('.modal-button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cancel')
  })
})
