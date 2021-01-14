import { shallowMount } from '@vue/test-utils'
import ListOption from '@/components/ListOption.vue'

describe('ListOption.vue', () => {
  it('returns correct option', async () => {
    const wrapper = shallowMount(ListOption, {
      props: {
        listType: 'test'
      }
    })
    const sut = wrapper.vm as typeof ListOption
    expect(sut.getOptions()).toEqual({
      count: 3,
      sortField: 'UPDATED_AT',
      sortDirection: 'DESC'
    })

    wrapper.setData({
      selectedValue: 'Newest'
    })
    expect(sut.getOptions()).toEqual({
      count: 3,
      sortField: 'CREATED_AT',
      sortDirection: 'DESC'
    })

    wrapper.setData({
      numberOfItems: 10,
      selectedValue: 'Least commented'
    })
    expect(sut.getOptions()).toEqual({
      count: 10,
      sortField: 'COMMENTS',
      sortDirection: 'ASC'
    })
  })

  it('shows/hides option', async () => {
    const wrapper = shallowMount(ListOption, {
      props: {
        listType: 'test'
      }
    })
    expect(wrapper.find('.open-button').exists()).toBe(true)
    expect(wrapper.find('.close-button').exists()).toBe(false)

    await wrapper.find('.app-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.open-button').exists()).toBe(false)
    expect(wrapper.find('.close-button').exists()).toBe(true)

    await wrapper.find('.app-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.open-button').exists()).toBe(true)
    expect(wrapper.find('.close-button').exists()).toBe(false)
  })
})
