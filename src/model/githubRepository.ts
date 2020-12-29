export type IssueLabel = {
  name: string;
  color: string;
}

export type IssueLabelEdge = {
  edges: Array<IssueLabel>;
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
