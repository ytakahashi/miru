import { GraphQLClient, gql } from 'graphql-request'
import { GitHubUrl } from '@/domain/model/github'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
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

  public getIssues = async (personalAccessToken: string, url: RepositoryUrl): Promise<IssueConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getIssues($owner: String!, $name: String!, $firstIssueNumber: Int!) {
        repository(owner:$owner, name:$name) {
          issues(first:$firstIssueNumber, states:OPEN, orderBy:{field: UPDATED_AT, direction: DESC}) {
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

    const variables = {
      owner: url.getOwner(),
      name: url.getRepositoryName(),
      firstIssueNumber: 3
    }

    const takeIssues = (r: Repository): IssueConnection => {
      if (r.repository?.issues) {
        return r.repository.issues
      } else {
        throw Error(`Failed to get issues: ${url.getUrl()}.`)
      }
    }
    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders).then(takeIssues)
  }

  public getPullRequests = async (personalAccessToken: string, url: RepositoryUrl): Promise<PullRequestConnection> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getPRs($owner: String!, $name: String!, $firstIssueNumber: Int!) {
        repository(owner:$owner, name:$name) {
          pullRequests(first:$firstIssueNumber, states:OPEN, orderBy:{field: UPDATED_AT, direction: DESC}) {
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
                isDraft
              }
            }
          }
        }
      }`

    const variables = {
      owner: url.getOwner(),
      name: url.getRepositoryName(),
      firstIssueNumber: 3
    }

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
