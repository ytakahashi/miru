export type GitHubUser = {
  avatarUrl: string;
  login: string;
  url: string;
}

export type Viewer = {
  viewer: GitHubUser;
}

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

export type IssueCommentConnection = {
  totalCount: number;
}

export type UserConnection = {
  totalCount: number;
}

export type Issue = {
  author: GitHubUser;
  title: string;
  url: string;
  comments: IssueCommentConnection;
  createdAt: string;
  updatedAt: string;
  labels: IssueLabelEdge;
  number: number;
  participants: UserConnection;
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
  repository?: GithubRepository;
}
