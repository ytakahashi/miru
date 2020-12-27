import { GraphQLClient, gql } from 'graphql-request'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { Viewer } from '@/model/github'

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
}
