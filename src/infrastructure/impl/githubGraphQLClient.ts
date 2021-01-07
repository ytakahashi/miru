import { GraphQLClient, gql } from 'graphql-request'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { GitHubUrl } from '@/domain/model/github'
import { Repository, Viewer } from '@/infrastructure/dto/githubApi'

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

  public getIssues = async (personalAccessToken: string, owner: string, name: string): Promise<Repository> => {
    const requestHeaders = {
      authorization: `Bearer ${personalAccessToken}`
    }
    const query = gql`
      query getIssues($owner: String!, $name: String!, $firstIssueNumber: Int!) {
        repository(owner:$owner, name:$name) {
          issues(first:$firstIssueNumber, states:OPEN, orderBy:{field: UPDATED_AT, direction: DESC}) {
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
      owner: owner,
      name: name,
      firstIssueNumber: 3
    }

    return this.#graphQLClient.request<Repository>(query, variables, requestHeaders)
  }
}
