import { mount } from '@vue/test-utils'
import LoadingImage from '@/components/LoadingImage.vue'

describe('LoadingImage.vue', () => {
  it('appears during loading', () => {
    const wrapper = mount(LoadingImage, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('emits', async () => {
    const elem = document.createElement('div')
    document.body.appendChild(elem)

    const wrapper = mount(LoadingImage, {
      attachTo: elem,
      props: {
        loading: true,
      },
    })

    await wrapper.find('div').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cancel')
  })

  it('renders nothing when not loading', () => {
    const wrapper = mount(LoadingImage, {
      props: {
        loading: false,
      },
    })

    expect(wrapper.find('div').exists()).toBe(false)
    expect(wrapper.find('span').exists()).toBe(false)
  })
})
