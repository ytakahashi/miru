import QueryOption from '@/components/QueryOption.vue'
import { shallowMount } from '@vue/test-utils'

describe('QueryOption.vue', () => {
  it('shows/hides option', async () => {
    const wrapper = shallowMount(QueryOption, {
      props: {
        viewType: 'issues',
      },
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

  it('shows correct option values for issues', async () => {
    const wrapper = shallowMount(QueryOption, {
      props: {
        viewType: 'issues',
      },
    })
    await wrapper.find('.fa-cog').trigger('click')
    await wrapper.vm.$nextTick()
    const text = wrapper.text()
    expect(text).toContain('Newest')
    expect(text).toContain('Oldest')
    expect(text).toContain('Most commented')
    expect(text).toContain('Least commented')
    expect(text).toContain('Recently updated')
    expect(text).toContain('Least recently updated')
    expect(text).not.toContain('Alphabetical')
    expect(text).not.toContain('Reverse alphabetical')
  })

  it('shows correct option values for pullRequests', async () => {
    const wrapper = shallowMount(QueryOption, {
      props: {
        viewType: 'pullRequests',
      },
    })
    await wrapper.find('.fa-cog').trigger('click')
    await wrapper.vm.$nextTick()
    const text = wrapper.text()
    expect(text).toContain('Newest')
    expect(text).toContain('Oldest')
    expect(text).toContain('Most commented')
    expect(text).toContain('Least commented')
    expect(text).toContain('Recently updated')
    expect(text).toContain('Least recently updated')
    expect(text).not.toContain('Alphabetical')
    expect(text).not.toContain('Reverse alphabetical')
  })

  it('shows correct option values for releases', async () => {
    const wrapper = shallowMount(QueryOption, {
      props: {
        viewType: 'releases',
      },
    })
    await wrapper.find('.fa-cog').trigger('click')
    await wrapper.vm.$nextTick()
    const text = wrapper.text()
    expect(text).toContain('Newest')
    expect(text).toContain('Oldest')
    expect(text).not.toContain('Most commented')
    expect(text).not.toContain('Least commented')
    expect(text).not.toContain('Recently updated')
    expect(text).not.toContain('Least recently updated')
    expect(text).toContain('Alphabetical')
    expect(text).toContain('Reverse alphabetical')
  })

  it('can update option values', async () => {
    const wrapper = shallowMount(QueryOption, {
      props: {
        viewType: 'issues',
      },
    })

    // check default value
    const actual1 = wrapper.vm.viewModel.getOption()
    expect(actual1).toEqual({
      count: 10,
      sortField: 'UPDATED_AT',
      sortDirection: 'DESC',
      states: ['OPEN'],
    })

    await wrapper.find('.fa-cog').trigger('click')

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes).toHaveLength(2)

    // update options (1)
    // - count -> 3
    // - sort -> Newest
    // - state -> CLOSED
    await wrapper.find('select.number-input').setValue(3)
    await wrapper.find('select.sort-input').setValue('Newest')
    await checkboxes[0].setValue(false)
    await checkboxes[1].setValue(true)

    const actual2 = wrapper.vm.viewModel.getOption()
    expect(actual2).toEqual({
      count: 3,
      sortField: 'CREATED_AT',
      sortDirection: 'DESC',
      states: ['CLOSED'],
    })

    // update options (2)
    // - count -> 20
    // - sort -> Least commented
    // - state -> OPEN, CLOSED
    await wrapper.find('select.number-input').setValue(20)
    await wrapper.find('select.sort-input').setValue('Least commented')
    await checkboxes[0].setValue(true)
    const actual3 = wrapper.vm.viewModel.getOption()
    expect(actual3).toEqual({
      count: 20,
      sortField: 'COMMENTS',
      sortDirection: 'ASC',
      states: ['CLOSED', 'OPEN'],
    })
  })
})
