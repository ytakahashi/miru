import { GraphQLClient, gql } from 'graphql-request'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { Repository, Viewer } from '@/model/dto/githubApi'
import { GitHubUrl } from '@/model/github'

export class GitHubGraphQLClient implements GitHubAccessor {
  #graphQLClient: GraphQLClient

  constructor (gitHubUrl: GitHubUrl) {
    this.#graphQLClient = new GraphQLClient(gitHubUrl.apiEndpoint)
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
