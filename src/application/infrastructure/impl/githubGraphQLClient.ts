import { GraphQLClient, gql } from 'graphql-request'
import { GitHubUrl } from '@/application/domain/model/github'
import { GitHubAccessor, Option } from '@/application/domain/interface/githubAccessor'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection, ReleaseConnection, Repository, Viewer } from '@/application/infrastructure/dto/githubApi'

export class GitHubGraphQLClient implements GitHubAccessor {
  #graphQLClient: GraphQLClient

  constructor (gitHubUrl: GitHubUrl) {
    this.#graphQLClient = new GraphQLClient(gitHubUrl.getApiEndpoint())
  }

  public getViewer = async (personalAccessToken: string): Promise<Viewer> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`{
      viewer {
        avatarUrl
        login
        url
      }
    }`
    return this.#graphQLClient.request<Viewer>(query, {}, requestHeaders)
  }

  public getIssues = async (personalAccessToken: string, setting: RepositorySetting, opts?: Option): Promise<IssueConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getIssues($owner: String!, $name: String!, $firstIssueNumber: Int!, $sortField: String!, $sortDirection: String!) {
        repository(owner:$owner, name:$name) {
          issues(first:$firstIssueNumber, states:OPEN, orderBy:{field: $sortField, direction: $sortDirection}) {
            totalCount
            edges {
              node {
                assignees(first:5) {
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
                labels(first:10) {
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
              }
            }
          }
        }
      }`

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstIssueNumber: opts?.count !== undefined ? opts.count : 10,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'UPDATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC'
    }
    const takeIssues = (r: Repository): IssueConnection => {
      if (r.repository?.issues) {
        return r.repository.issues
      } else {
        throw Error(`Failed to get issues: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takeIssues)
  }

  public getPullRequests = async (personalAccessToken: string, setting: RepositorySetting, opts?: Option): Promise<PullRequestConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getPRs($owner: String!, $name: String!, $firstIssueNumber: Int!, $sortField: String!, $sortDirection: String!) {
        repository(owner:$owner, name:$name) {
          pullRequests(first:$firstIssueNumber, states:OPEN, orderBy:{field: $sortField, direction: $sortDirection}) {
            totalCount
            edges {
              node {
                assignees(first:5) {
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
                labels(first:10) {
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
                reviewRequests(first:5) {
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
              }
            }
          }
        }
      }`

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstIssueNumber: opts?.count !== undefined ? opts.count : 10,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'UPDATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC'
    }
    const takePullRequests = (r: Repository): PullRequestConnection => {
      if (r.repository?.pullRequests) {
        return r.repository.pullRequests
      } else {
        throw Error(`Failed to get PRs: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takePullRequests)
  }

  public getReleases = async (personalAccessToken: string, setting: RepositorySetting, opts?: Option): Promise<ReleaseConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getReleases($owner: String!, $name: String!, $firstNumber: Int!, $sortField: String!, $sortDirection: String!) {
        repository(owner:$owner, name:$name) {
          releases(first:$firstNumber, orderBy:{field: $sortField, direction: $sortDirection}) {
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
      }`

    const variables = {
      owner: setting.getOwner(),
      name: setting.getRepositoryName(),
      firstNumber: opts?.count !== undefined ? opts.count : 3,
      sortField: opts?.sortField !== undefined ? opts.sortField : 'CREATED_AT',
      sortDirection: opts?.sortDirection !== undefined ? opts.sortDirection : 'DESC'
    }
    const takeReleases = (r: Repository): ReleaseConnection => {
      if (r.repository?.releases) {
        return r.repository.releases
      } else {
        throw Error(`Failed to get Releases: ${setting.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takeReleases)
  }
}
