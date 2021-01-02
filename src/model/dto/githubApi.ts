export type IssueLabel = {
  name: string;
  color: string;
}

export type IssueLabelNode = {
  node: IssueLabel;
}

export type IssueLabelEdge = {
  cursor?: string;
  edges: Array<IssueLabelNode>;
}

export type Issue = {
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  labels: IssueLabelEdge;
}

export type IssueNode = {
  node: Issue;
}

export type IssueEdge = {
  cursor?: string;
  edges: Array<IssueNode>;
}

export type GithubRepository = {
  issues: IssueEdge;
}

export type Repository = {
  repository: GithubRepository;
}

export type GitHubUser = {
  avatarUrl: string;
  login: string;
  url: string;
}

export type Viewer = {
  viewer: GitHubUser;
}
