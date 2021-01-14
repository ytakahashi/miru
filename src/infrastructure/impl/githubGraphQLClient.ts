import { GraphQLClient, gql } from 'graphql-request'
import { GitHubUrl } from '@/domain/model/github'
import { GitHubAccessor, Option } from '@/domain/interface/githubAccessor'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection, Repository, Viewer } from '@/infrastructure/dto/githubApi'

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

  public getIssues = async (personalAccessToken: string, url: RepositoryUrl, opts?: Option): Promise<IssueConnection> => {
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
              }
            }
          }
        }
      }`

    const variables = buildVariables(url, opts)
    const takeIssues = (r: Repository): IssueConnection => {
      if (r.repository?.issues) {
        return r.repository.issues
      } else {
        throw Error(`Failed to get issues: ${url.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takeIssues)
  }

  public getPullRequests = async (personalAccessToken: string, url: RepositoryUrl, opts?: Option): Promise<PullRequestConnection> => {
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
              }
            }
          }
        }
      }`

    const variables = buildVariables(url, opts)
    const takePullRequests = (r: Repository): PullRequestConnection => {
      if (r.repository?.pullRequests) {
        return r.repository.pullRequests
      } else {
        throw Error(`Failed to get PRs: ${url.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takePullRequests)
  }
}

type RequestVariable = {
    owner: string;
    name: string;
    firstIssueNumber: number;
    sortField: string;
    sortDirection: string;
}

const buildVariables = (url: RepositoryUrl, opts?: Option): RequestVariable => {
  const cnt = opts?.count
  const field = opts?.sortField
  const direction = opts?.sortDirection
  return {
    owner: url.getOwner(),
    name: url.getRepositoryName(),
    firstIssueNumber: cnt !== undefined ? cnt : 10,
    sortField: field !== undefined ? field : 'UPDATED_AT',
    sortDirection: direction !== undefined ? direction : 'DESC'
  }
}
