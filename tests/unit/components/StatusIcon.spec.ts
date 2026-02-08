import { mount } from '@vue/test-utils'
import StatusIcon from '@/components/StatusIcon.vue'
import { describe, it, expect } from 'vitest'

describe('StatusIcon.vue', () => {
  it('renders nothing when status is empty', () => {
    const wrapper = mount(StatusIcon, {
      props: {
        status: '',
      },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('renders success icon', () => {
    const wrapper = mount(StatusIcon, {
      props: {
        status: 'SUCCESS',
      },
    })
    expect(wrapper.find('.icon-success').exists()).toBe(true)
  })

  it('renders failure icon', () => {
    const wrapper = mount(StatusIcon, {
      props: {
        status: 'FAILURE',
      },
    })
    expect(wrapper.find('.icon-failure').exists()).toBe(true)
  })

  it('renders pending icon', () => {
    const wrapper = mount(StatusIcon, {
      props: {
        status: 'PENDING',
      },
    })
    expect(wrapper.find('.icon-pending').exists()).toBe(true)
  })

  it('renders neutral icon for unknown status', () => {
    const wrapper = mount(StatusIcon, {
      props: {
        status: 'ABORTED',
      },
    })
    expect(wrapper.find('.icon-neutral').exists()).toBe(true)
  })
})
