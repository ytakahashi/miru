export type GitHubUser = {
    avatarUrl: string;
    login: string;
    url: string;
}

export type Viewer = {
  viewer: GitHubUser;
}
