import { logger } from '@/application/core/logger.js'
import {
  GitHubAccessError,
  GitHubAccessor,
  Option,
} from '@/application/domain/interface/githubAccessor.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import {
  CommitHistoryConnection,
  IssueConnection,
  PullRequestConnection,
  ReleaseConnection,
  Repository,
  Viewer,
} from '@/application/infrastructure/dto/githubApi.js'
import { GraphQLClient, gql } from 'graphql-request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeGitHubAccessError = (e: any): GitHubAccessError =>
  new GitHubAccessError(
    e.response.status === 200 ? e.response.errors[0].message : e.response.message,
    { cause: e }
  )

export class GitHubGraphQLClient implements GitHubAccessor {
  #graphQLClient: GraphQLClient

  constructor(gitHubUrl: GitHubUrl) {
    this.#graphQLClient = new GraphQLClient(gitHubUrl.getApiEndpoint())
  }

  public getViewer = async (personalAccessToken: string): Promise<Viewer> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`,
    }
    const query = gql`
      {
        viewer {
          avatarUrl
          login
          url
        }
      }
    `
    return this.#graphQLClient.request<Viewer>(query, {}, requestHeaders)
  }

  public getIssues = async (
    personalAccessToken: string,
    setting: RepositorySetting,
    opts?: Option
  ): Promise<IssueConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`,
    }
    const query = gql`
      query getIssues(
        $owner: String!
        $name: String!
        $firstIssueNumber: Int!
        $state: [IssueState!]
        $sortField: IssueOrderField!
        $sortDirection: OrderDirection!
      ) {
        repository(owner: $owner, name: $name) {
          issues(
            first: $firstIssueNumber
            states: $state
            orderBy: { field: $sortField, direction: $sortDirection }
          ) {
            totalCount
            edges {
              node {
                assignees(first: 5) {
                  nodes {
                    isViewer
                  }
                }
                author {
                  avatarUrl
                  login
                  url
                }
                comments {
                  totalCount
                }
                title
                url
                createdAt
                updatedAt
                labels(first: 10) {
                  edges {
                    node {
                      name
                      color
                    }
                  }
                }
                number
                participants {
                  totalCount
                }
                viewerDidAuthor
                state
                stateReason
              }
            }
          }
        }
      }
    `

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstIssueNumber: opts?.count !== undefined ? opts.count : 10,
      state: opts?.states,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'UPDATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC',
    }
    logger.verbose(`Issues variable: ${JSON.stringify(variables)}`)
    const takeIssues = (r: Repository): IssueConnection => {
      if (r.repository?.issues) {
        return r.repository.issues
      } else {
        throw Error(`Failed to get issues: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient
      .request<Repository>(query, variables, requestHeaders)
      .then(takeIssues)
      .catch(e => {
        logger.error(e)
        throw makeGitHubAccessError(e)
      })
  }

  public getPullRequests = async (
    personalAccessToken: string,
    setting: RepositorySetting,
    opts?: Option
  ): Promise<PullRequestConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`,
    }
    const query = gql`
      query getPRs(
        $owner: String!
        $name: String!
        $firstIssueNumber: Int!
        $state: [PullRequestState!]
        $sortField: IssueOrderField!
        $sortDirection: OrderDirection!
      ) {
        repository(owner: $owner, name: $name) {
          pullRequests(
            first: $firstIssueNumber
            states: $state
            orderBy: { field: $sortField, direction: $sortDirection }
          ) {
            totalCount
            edges {
              node {
                assignees(first: 5) {
                  nodes {
                    isViewer
                  }
                }
                author {
                  login
                }
                title
                url
                comments {
                  totalCount
                }
                createdAt
                updatedAt
                labels(first: 10) {
                  edges {
                    node {
                      name
                      color
                    }
                  }
                }
                number
                participants {
                  totalCount
                }
                additions
                deletions
                changedFiles
                isDraft
                reviews(first: 30) {
                  totalCount
                  nodes {
                    body
                    comments(first: 20) {
                      totalCount
                    }
                  }
                }
                reviewRequests(first: 5) {
                  nodes {
                    requestedReviewer {
                      ... on User {
                        isViewer
                        login
                        name
                      }
                    }
                  }
                }
                viewerDidAuthor
                state
                commits(last: 1) {
                  nodes {
                    commit {
                      statusCheckRollup {
                        state
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstIssueNumber: opts?.count !== undefined ? opts.count : 10,
      state: opts?.states,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'UPDATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC',
    }
    logger.verbose(`PullRequests variable: ${JSON.stringify(variables)}`)
    const takePullRequests = (r: Repository): PullRequestConnection => {
      if (r.repository?.pullRequests) {
        return r.repository.pullRequests
      } else {
        throw Error(`Failed to get PRs: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient
      .request<Repository>(query, variables, requestHeaders)
      .then(takePullRequests)
      .catch(e => {
        logger.error(e)
        throw makeGitHubAccessError(e)
      })
  }

  public getReleases = async (
    personalAccessToken: string,
    setting: RepositorySetting,
    opts?: Option
  ): Promise<ReleaseConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`,
    }
    const query = gql`
      query getReleases(
        $owner: String!
        $name: String!
        $firstNumber: Int!
        $sortField: ReleaseOrderField!
        $sortDirection: OrderDirection!
      ) {
        repository(owner: $owner, name: $name) {
          releases(first: $firstNumber, orderBy: { field: $sortField, direction: $sortDirection }) {
            totalCount
            edges {
              node {
                author {
                  login
                }
                createdAt
                isDraft
                isPrerelease
                name
                publishedAt
                releaseAssets(first: 0) {
                  totalCount
                }
                updatedAt
                tag {
                  name
                  target {
                    abbreviatedOid
                    commitUrl
                    oid
                  }
                }
                tagName
                updatedAt
                url
              }
            }
          }
        }
      }
    `

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstNumber: opts?.count !== undefined ? opts.count : 3,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'CREATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC',
    }
    const takeReleases = (r: Repository): ReleaseConnection => {
      if (r.repository?.releases) {
        return r.repository.releases
      } else {
        throw Error(`Failed to get Releases: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient
      .request<Repository>(query, variables, requestHeaders)
      .then(takeReleases)
      .catch(e => {
        logger.error(e)
        throw makeGitHubAccessError(e)
      })
  }

  public getCommits = async (
    personalAccessToken: string,
    setting: RepositorySetting,
    opts?: Option
  ): Promise<CommitHistoryConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`,
    }
    const query = gql`
      query getCommits($owner: String!, $name: String!, $firstNumber: Int!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: $firstNumber) {
                  nodes {
                    additions
                    author {
                      user {
                        login
                      }
                    }
                    authoredDate
                    changedFilesIfAvailable
                    commitUrl
                    committedDate
                    committer {
                      user {
                        login
                      }
                    }
                    deletions
                    message
                    statusCheckRollup {
                      state
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstNumber: opts?.count !== undefined ? opts.count : 3,
    }
    const takeCommitHistories = (r: Repository): CommitHistoryConnection => {
      if (r.repository?.defaultBranchRef?.target?.history) {
        return r.repository?.defaultBranchRef?.target?.history
      } else {
        throw Error(`Failed to get commit histories: ${setting.getUrl()}, ${r}.`)
      }
    }
    return this.#graphQLClient
      .request<Repository>(query, variables, requestHeaders)
      .then(takeCommitHistories)
      .catch(e => {
        logger.error(e)
        throw makeGitHubAccessError(e)
      })
  }
}
