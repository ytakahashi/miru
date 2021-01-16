import { mount } from '@vue/test-utils'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

describe('ThemeSwitch.vue', () => {
  it('changes theme', async () => {
    const wrapper = mount(ThemeSwitch)

    // default
    expect(wrapper.find('.fa-sun').exists()).toBe(false)
    expect(wrapper.find('.fa-moon').exists()).toBe(true)

    // dark mode: off
    await wrapper.find('input[type=checkbox]').setValue(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.fa-sun').exists()).toBe(true)
    expect(wrapper.find('.fa-moon').exists()).toBe(false)

    // dark mode: on
    await wrapper.find('input[type=checkbox]').setValue(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.fa-sun').exists()).toBe(false)
    expect(wrapper.find('.fa-moon').exists()).toBe(true)
  })
})
