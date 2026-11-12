import type { Option } from '@/application/domain/interface/githubAccessor'
import { computed, ComputedRef, Ref, shallowRef } from 'vue'

// Implementations must be immutable and replaced on every store update: usePagedList compares
// identities to tell whether the list a request started from is still the one being displayed.
export interface PagedList {
  readonly results: ReadonlyArray<unknown>
  readonly totalCount?: number
  hasContents(): boolean
  hasNextPage(): boolean
  nextPageOption(): Option | undefined
}

type Params<T extends PagedList> = {
  list: Readonly<Ref<T | undefined>>
  // Plural noun used in the summary, e.g. "issues".
  itemName: string
  fetchPage: (option: Option) => Promise<T>
  appendPage: (page: T) => void
  // Only records failures of the displayed list (they are shown via loadMoreError);
  // stale failures are dropped silently.
  logError: (error: Error) => void
}

type PagedListState = {
  summary: ComputedRef<string>
  canLoadMore: ComputedRef<boolean>
  loadingMore: ComputedRef<boolean>
  // Message of the latest Load more failure for the displayed list, or empty.
  loadMoreError: ComputedRef<string>
  // Never rejects; failures are exposed through loadMoreError and logError.
  loadMore: () => Promise<void>
}

type Failure<T> = { source: T; message: string }

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)))

export const usePagedList = <T extends PagedList>({
  list,
  itemName,
  fetchPage,
  appendPage,
  logError,
}: Params<T>): PagedListState => {
  // Both states are bound to their source list, so a refresh, a clear or a successful append
  // resets them without explicit bookkeeping.
  const pendingSource = shallowRef<T>()
  const failure = shallowRef<Failure<T>>()

  // Only a request for the displayed list counts as loading; a refreshed or cleared list
  // must not wait for a stale request to settle.
  const loadingMore = computed(
    () => pendingSource.value !== undefined && pendingSource.value === list.value
  )
  const loadMoreError = computed(() =>
    failure.value !== undefined && failure.value.source === list.value ? failure.value.message : ''
  )
  const canLoadMore = computed(() => list.value?.hasNextPage() === true)
  const summary = computed(() => {
    const { value } = list
    if (value === undefined || !value.hasContents() || value.totalCount === undefined) {
      return ''
    }
    return `showing ${value.results.length} of ${value.totalCount} ${itemName}`
  })

  const loadMore = async (): Promise<void> => {
    const source = list.value
    const option = source?.nextPageOption()
    if (source === undefined || option === undefined || loadingMore.value) {
      return
    }
    pendingSource.value = source
    failure.value = undefined
    try {
      const page = await fetchPage(option)
      // Replaced or removed lists must ignore both results and errors from older requests.
      if (list.value !== source) {
        return
      }
      appendPage(page)
    } catch (e) {
      if (list.value === source) {
        const error = toError(e)
        failure.value = { source, message: error.message }
        logError(error)
      }
    } finally {
      // A newer request may already own the pending state after the list was replaced.
      if (pendingSource.value === source) {
        pendingSource.value = undefined
      }
    }
  }

  return { summary, canLoadMore, loadingMore, loadMoreError, loadMore }
}
