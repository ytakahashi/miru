export type GitHubAccount = {
  userName: string;
  profileUrl: string;
  avatarUrl: string;
  githubUrl: string;
  githubApiEndpoint: string;
  personalAccessToken: string;
}

export type RepositorySetting = {
  url: string;
  showsCommits?: boolean;
  showsIssues: boolean;
  showsPullRequests: boolean;
  showsReleases: boolean;
}
