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

export type IssueEdge = {
  cursor?: string;
  node: Issue;
}

export type IssueConnection = {
  cursor?: string;
  totalCount?: number;
  edges: Array<IssueEdge>;
}

export type PullRequest = {
  author: GitHubUser;
  title: string;
  url: string;
  comments: IssueCommentConnection;
  createdAt: string;
  updatedAt: string;
  labels: IssueLabelEdge;
  number: number;
  participants: UserConnection;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export type PullRequestEdge = {
  cursor?: string;
  node: PullRequest;
}

export type PullRequestConnection = {
  cursor?: string;
  totalCount?: number;
  edges: Array<PullRequestEdge>;
}

export type GithubRepository = {
  issues?: IssueConnection;
  pullRequests?: PullRequestConnection;
}

export type Repository = {
  repository?: GithubRepository;
}
