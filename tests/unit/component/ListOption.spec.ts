import { shallowMount } from '@vue/test-utils'
import ListOption from '@/components/ListOption.vue'

describe('ListOption.vue', () => {
  it('shows/hides option', async () => {
    const wrapper = shallowMount(ListOption, {
      props: {
        viewType: 'issues'
      }
    })
    expect(wrapper.find('.open-button').exists()).toBe(true)
    expect(wrapper.find('.fa-cog').exists()).toBe(true)
    expect(wrapper.find('.close-button').exists()).toBe(false)
    expect(wrapper.find('.fa-times').exists()).toBe(false)

    // open option menu
    await wrapper.find('.fa-cog').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.open-button').exists()).toBe(false)
    expect(wrapper.find('.fa-cog').exists()).toBe(false)
    expect(wrapper.find('.close-button').exists()).toBe(true)
    expect(wrapper.find('.fa-times').exists()).toBe(true)

    // close option menu
    await wrapper.find('.fa-times').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.open-button').exists()).toBe(true)
    expect(wrapper.find('.fa-cog').exists()).toBe(true)
    expect(wrapper.find('.close-button').exists()).toBe(false)
    expect(wrapper.find('.fa-times').exists()).toBe(false)
  })

  it('shows correct option values', async () => {
    const wrapper = shallowMount(ListOption, {
      props: {
        viewType: 'issues'
      }
    })

    // check default value
    const actual1 = wrapper.vm.viewModel.getOption()
    expect(actual1).toEqual({
      count: 10,
      sortField: 'UPDATED_AT',
      sortDirection: 'DESC'
    })

    await wrapper.find('.fa-cog').trigger('click')

    // update options (1)
    await wrapper.find('select.number-input').setValue(3)
    await wrapper.find('select.sort-input').setValue('Newest')
    const actual2 = wrapper.vm.viewModel.getOption()
    expect(actual2).toEqual({
      count: 3,
      sortField: 'CREATED_AT',
      sortDirection: 'DESC'
    })

    // update options (2)
    await wrapper.find('select.number-input').setValue(20)
    await wrapper.find('select.sort-input').setValue('Least commented')
    const actual3 = wrapper.vm.viewModel.getOption()
    expect(actual3).toEqual({
      count: 20,
      sortField: 'COMMENTS',
      sortDirection: 'ASC'
    })
  })
})
