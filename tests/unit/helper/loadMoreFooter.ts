import LoadMoreFooter from '@/components/LoadMoreFooter.vue'
import { flushPromises, VueWrapper } from '@vue/test-utils'

type FooterWrapper = VueWrapper<InstanceType<typeof LoadMoreFooter>>

export const findLoadMoreFooter = (wrapper: VueWrapper): FooterWrapper =>
  wrapper.findComponent(LoadMoreFooter)

// Emits from the (possibly stubbed) footer so view tests do not depend on its markup.
export const clickLoadMore = async (wrapper: VueWrapper): Promise<void> => {
  findLoadMoreFooter(wrapper).vm.$emit('loadMore')
  await flushPromises()
}
