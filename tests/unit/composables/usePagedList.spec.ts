import type { Option } from '@/application/domain/interface/githubAccessor'
import { PagedList, usePagedList } from '@/composables/usePagedList'
import { deferred } from '../helper/deferred'
import { vi } from 'vite-plus/test'
import { shallowRef } from 'vue'

type FakeList = PagedList & { readonly id: string }

const list = (
  id: string,
  {
    cursor,
    totalCount = 3,
    results = [id],
  }: { cursor?: string; totalCount?: number; results?: string[] } = {}
): FakeList => ({
  id,
  results,
  totalCount,
  hasContents: () => results.length !== 0,
  hasNextPage: () => cursor !== undefined,
  nextPageOption: () => (cursor === undefined ? undefined : { count: 1, after: cursor }),
})

const setup = (initial?: FakeList) => {
  const current = shallowRef<FakeList | undefined>(initial)
  const fetchPage = vi.fn<(option: Option) => Promise<FakeList>>()
  // Mirrors the stores, which replace the holder instance on every append.
  const appendPage = vi.fn((page: FakeList) => {
    current.value = page
  })
  const logError = vi.fn<(error: Error) => void>()
  const state = usePagedList({ list: current, itemName: 'items', fetchPage, appendPage, logError })
  return { current, fetchPage, appendPage, logError, ...state }
}

describe('usePagedList', () => {
  describe('summary', () => {
    it.each([
      ['no list', undefined],
      ['an empty list', list('empty', { results: [] })],
      ['an unknown totalCount', { ...list('first'), totalCount: undefined }],
    ])('is empty with %s', (_, initial) => {
      expect(setup(initial).summary.value).toBe('')
    })

    it('shows loaded and total counts', () => {
      expect(setup(list('first', { totalCount: 10 })).summary.value).toBe('showing 1 of 10 items')
    })
  })

  it('follows hasNextPage of the current list', () => {
    const { current, canLoadMore } = setup()
    expect(canLoadMore.value).toBe(false)
    current.value = list('first', { cursor: 'cursor-1' })
    expect(canLoadMore.value).toBe(true)
    current.value = list('last')
    expect(canLoadMore.value).toBe(false)
  })

  it('fetches the next page option and appends the result', async () => {
    const { fetchPage, appendPage, loadingMore, loadMore } = setup(
      list('first', { cursor: 'cursor-1' })
    )
    const next = list('second')
    const pending = deferred<FakeList>()
    fetchPage.mockReturnValueOnce(pending.promise)

    const loading = loadMore()
    expect(fetchPage).toHaveBeenCalledExactlyOnceWith({ count: 1, after: 'cursor-1' })
    expect(loadingMore.value).toBe(true)

    pending.resolve(next)
    await loading
    expect(appendPage).toHaveBeenCalledExactlyOnceWith(next)
    expect(loadingMore.value).toBe(false)
  })

  it.each([
    ['no list', undefined],
    ['no next page', list('last')],
  ])('ignores calls with %s', async (_, initial) => {
    const { fetchPage, loadingMore, loadMore } = setup(initial)
    await loadMore()
    expect(fetchPage).not.toHaveBeenCalled()
    expect(loadingMore.value).toBe(false)
  })

  it('guards repeated calls for the same list while pending', async () => {
    const { fetchPage, loadMore } = setup(list('first', { cursor: 'cursor-1' }))
    const pending = deferred<FakeList>()
    fetchPage.mockReturnValueOnce(pending.promise)

    const loading = loadMore()
    await loadMore()
    expect(fetchPage).toHaveBeenCalledTimes(1)

    pending.resolve(list('second'))
    await loading
  })

  describe('on failure', () => {
    it('reports a failure for the current list and keeps it intact', async () => {
      const source = list('first', { cursor: 'cursor-1' })
      const { current, fetchPage, appendPage, logError, loadingMore, loadMoreError, loadMore } =
        setup(source)
      const error = new Error('rate limit')
      fetchPage.mockRejectedValueOnce(error)

      await expect(loadMore()).resolves.toBeUndefined()
      expect(logError).toHaveBeenCalledExactlyOnceWith(error)
      expect(loadMoreError.value).toBe('rate limit')
      expect(appendPage).not.toHaveBeenCalled()
      expect(current.value).toBe(source)
      expect(loadingMore.value).toBe(false)
    })

    it('reports a failure while appending the page', async () => {
      const error = new Error('Cannot concatenate results')
      const { fetchPage, appendPage, logError, loadMoreError, loadMore } = setup(
        list('first', { cursor: 'cursor-1' })
      )
      fetchPage.mockResolvedValueOnce(list('second'))
      appendPage.mockImplementationOnce(() => {
        throw error
      })

      await loadMore()
      expect(logError).toHaveBeenCalledExactlyOnceWith(error)
      expect(loadMoreError.value).toBe('Cannot concatenate results')
    })

    it('clears the error when a retry starts and after it succeeds', async () => {
      const { fetchPage, loadMoreError, loadMore } = setup(list('first', { cursor: 'cursor-1' }))
      const retry = deferred<FakeList>()
      fetchPage.mockRejectedValueOnce(new Error('rate limit')).mockReturnValueOnce(retry.promise)
      await loadMore()

      const retrying = loadMore()
      expect(loadMoreError.value).toBe('')

      retry.resolve(list('second'))
      await retrying
      expect(loadMoreError.value).toBe('')
    })

    it.each([
      ['replaced', () => list('replacement')],
      ['removed', () => undefined],
    ])('hides the error once the list is %s', async (_, nextList) => {
      const { current, fetchPage, loadMoreError, loadMore } = setup(
        list('first', { cursor: 'cursor-1' })
      )
      fetchPage.mockRejectedValueOnce(new Error('rate limit'))
      await loadMore()

      current.value = nextList()
      expect(loadMoreError.value).toBe('')
    })
  })

  describe.each([
    ['replaced', () => list('replacement')],
    ['removed', () => undefined],
  ])('when the list is %s while pending', (_, nextList) => {
    it('discards a successful response', async () => {
      const { current, fetchPage, appendPage, loadMore } = setup(
        list('first', { cursor: 'cursor-1' })
      )
      const pending = deferred<FakeList>()
      fetchPage.mockReturnValueOnce(pending.promise)

      const loading = loadMore()
      const replacement = nextList()
      current.value = replacement
      pending.resolve(list('stale'))
      await loading

      expect(appendPage).not.toHaveBeenCalled()
      expect(current.value).toBe(replacement)
    })

    it('ignores a failed response', async () => {
      const { current, fetchPage, logError, loadMoreError, loadMore } = setup(
        list('first', { cursor: 'cursor-1' })
      )
      const pending = deferred<FakeList>()
      fetchPage.mockReturnValueOnce(pending.promise)

      const loading = loadMore()
      current.value = nextList()
      pending.reject(new Error('stale failure'))
      await loading

      expect(logError).not.toHaveBeenCalled()
      expect(loadMoreError.value).toBe('')
    })
  })

  it('lets a replaced list load more without waiting for the stale request', async () => {
    const { current, fetchPage, appendPage, loadingMore, loadMore } = setup(
      list('first', { cursor: 'cursor-1' })
    )
    const stale = deferred<FakeList>()
    const fresh = deferred<FakeList>()
    fetchPage.mockReturnValueOnce(stale.promise).mockReturnValueOnce(fresh.promise)

    const staleLoading = loadMore()
    current.value = list('refreshed', { cursor: 'fresh-cursor' })
    expect(loadingMore.value).toBe(false)

    const freshLoading = loadMore()
    expect(fetchPage).toHaveBeenNthCalledWith(2, { count: 1, after: 'fresh-cursor' })
    expect(loadingMore.value).toBe(true)

    // Settling the stale request must not clear the pending state owned by the newer one.
    stale.resolve(list('stale'))
    await staleLoading
    expect(loadingMore.value).toBe(true)

    const next = list('next')
    fresh.resolve(next)
    await freshLoading
    expect(appendPage).toHaveBeenCalledExactlyOnceWith(next)
    expect(loadingMore.value).toBe(false)
  })
})
