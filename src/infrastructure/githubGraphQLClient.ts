import { GraphQLClient, gql } from 'graphql-request'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { Viewer } from '@/model/githubUser'
import { Repository } from '@/model/githubRepository'

export class GitHubGraphQLClient implements GitHubAccessor {
  private graphQLClient: GraphQLClient

  constructor (endpoint: string, token: string) {
    this.graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  }

  public async getViewer (): Promise<Viewer> {
    const query = gql`{
      viewer {
        avatarUrl
        login
        url
      }
    }`
    return this.graphQLClient.request<Viewer>(query)
  }

  public async getIssues (owner: string, name: string): Promise<Repository> {
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

    return this.graphQLClient.request<Repository>(query, variables)
  }
}
