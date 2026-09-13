import { Logger } from '@/application/domain/interface/logger.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { GitHubGraphQLClient } from '@/application/infrastructure/impl/githubGraphQLClient.js'

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }))

vi.mock('graphql-request', () => ({
  GraphQLClient: class {
    request = requestMock
  },
  gql: (strings: TemplateStringsArray, ...values: unknown[]): string =>
    strings.reduce((result, value, index) => result + value + (values[index] ?? ''), ''),
}))

describe('GitHubGraphQLClient paging', () => {
  const logger: Logger = {
    error: vi.fn(),
    info: vi.fn(),
    verbose: vi.fn(),
  }
  const setting = new RepositorySetting('https://github.com/ytakahashi/miru')
  let sut: GitHubGraphQLClient

  beforeEach(() => {
    requestMock.mockReset()
    sut = new GitHubGraphQLClient(
      new GitHubUrl('https://github.com', 'https://api.github.com/graphql'),
      logger
    )
  })

  const requestedQuery = (): string => requestMock.mock.calls[0][0] as string
  const requestedVariables = (): Record<string, unknown> =>
    requestMock.mock.calls[0][1] as Record<string, unknown>

  it('requests an issues page without a cursor for the first page', async () => {
    requestMock.mockResolvedValue({
      repository: {
        issues: {
          totalCount: 0,
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: [],
        },
      },
    })

    await sut.getIssues('pat', setting, {
      count: 5,
      sortField: 'CREATED_AT',
      sortDirection: 'ASC',
      states: ['OPEN'],
    })

    expect(requestedQuery()).toContain('$after: String')
    expect(requestedQuery()).toContain('after: $after')
    expect(requestedQuery()).toMatch(/pageInfo\s*{\s*hasNextPage\s*endCursor\s*}/)
    expect(requestedVariables()).toMatchObject({
      firstIssueNumber: 5,
      after: null,
      sortField: 'CREATED_AT',
      sortDirection: 'ASC',
      state: ['OPEN'],
    })
  })

  it('requests a pull request page with its cursor', async () => {
    requestMock.mockResolvedValue({
      repository: {
        pullRequests: {
          totalCount: 0,
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: [],
        },
      },
    })

    await sut.getPullRequests('pat', setting, { count: 10, after: 'pull-request-cursor' })

    expect(requestedQuery()).toContain('$firstPullRequestNumber: Int!')
    expect(requestedQuery()).toContain('first: $firstPullRequestNumber')
    expect(requestedQuery()).toMatch(/pageInfo\s*{\s*hasNextPage\s*endCursor\s*}/)
    expect(requestedVariables()).toMatchObject({
      firstPullRequestNumber: 10,
      after: 'pull-request-cursor',
    })
  })

  it('requests a release page with its cursor', async () => {
    requestMock.mockResolvedValue({
      repository: {
        releases: {
          totalCount: 0,
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: [],
        },
      },
    })

    await sut.getReleases('pat', setting, { count: 3, after: 'release-cursor' })

    expect(requestedQuery()).toContain('after: $after')
    expect(requestedQuery()).toMatch(/pageInfo\s*{\s*hasNextPage\s*endCursor\s*}/)
    expect(requestedVariables()).toMatchObject({ firstNumber: 3, after: 'release-cursor' })
  })

  it('requests commit page information and total count with its cursor', async () => {
    requestMock.mockResolvedValue({
      repository: {
        defaultBranchRef: {
          target: {
            history: {
              totalCount: 0,
              pageInfo: { hasNextPage: false, endCursor: null },
              nodes: [],
            },
          },
        },
      },
    })

    await sut.getCommits('pat', setting, { count: 3, after: 'commit-cursor' })

    expect(requestedQuery()).toContain('history(first: $firstNumber, after: $after)')
    expect(requestedQuery()).toContain('totalCount')
    expect(requestedQuery()).toMatch(/pageInfo\s*{\s*hasNextPage\s*endCursor\s*}/)
    expect(requestedVariables()).toMatchObject({ firstNumber: 3, after: 'commit-cursor' })
  })
})
