import LoadMoreFooter from '@/components/LoadMoreFooter.vue'
import { mount } from '@vue/test-utils'

const mountFooter = (props: {
  summary?: string
  canLoadMore?: boolean
  loading?: boolean
  errorMessage?: string
}) =>
  mount(LoadMoreFooter, {
    props: { summary: '', canLoadMore: false, loading: false, ...props },
  })

describe('LoadMoreFooter.vue', () => {
  it('renders the summary only when given', () => {
    expect(mountFooter({ summary: 'showing 1 of 3 issues' }).text()).toBe('showing 1 of 3 issues')
    expect(mountFooter({}).find('span').exists()).toBe(false)
  })

  it('renders the error message only when given', () => {
    expect(mountFooter({ errorMessage: 'rate limit' }).find('.load-more-error').text()).toBe(
      'Failed to load more: rate limit'
    )
    expect(mountFooter({}).find('.load-more-error').exists()).toBe(false)
  })

  it('hides the button when no more pages can be loaded', () => {
    expect(mountFooter({ canLoadMore: false }).find('.load-more-button').exists()).toBe(false)
  })

  it('emits loadMore on click', async () => {
    const wrapper = mountFooter({ canLoadMore: true })
    const button = wrapper.find('.load-more-button')
    expect(button.text()).toBe('Load more')
    expect(button.attributes('disabled')).toBeUndefined()

    await button.trigger('click')
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
  })

  it('disables the button while loading', async () => {
    const wrapper = mountFooter({ canLoadMore: true, loading: true })
    const button = wrapper.find('.load-more-button')
    expect(button.text()).toBe('Loading…')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.emitted('loadMore')).toBeUndefined()
  })
})
