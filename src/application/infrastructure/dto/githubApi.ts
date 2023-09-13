export type GitHubUser = {
  avatarUrl: string
  login: string
  url: string
}

export type Viewer = {
  viewer: GitHubUser
}

export type IssueLabel = {
  name: string
  color: string
}

export type IssueLabelNode = {
  node: IssueLabel
}

export type IssueLabelEdge = {
  cursor?: string
  edges: Array<IssueLabelNode>
}

export type IssueCommentConnection = {
  totalCount: number
}

export type User = {
  isViewer: boolean
}

export type UserConnection = {
  nodes: User[]
  totalCount: number
}

export type Issue = {
  assignees: UserConnection
  author: GitHubUser
  title: string
  url: string
  comments: IssueCommentConnection
  createdAt: string
  updatedAt: string
  labels: IssueLabelEdge
  number: number
  participants: UserConnection
  state: string
  stateReason: string
  viewerDidAuthor: boolean
}

export type IssueEdge = {
  cursor?: string
  node: Issue
}

export type IssueConnection = {
  cursor?: string
  totalCount?: number
  edges: Array<IssueEdge>
}

export type PullRequestReviewCommentConnection = {
  totalCount: number
}

export type PillRequestReview = {
  body: string
  comments: PullRequestReviewCommentConnection
}

export type PillRequestReviewConnection = {
  totalCount: number
  nodes: PillRequestReview[]
}

export type UserRequestedReviewer = User

export type ReviewRequest = {
  requestedReviewer?: UserRequestedReviewer
}

export type ReviewRequestConnection = {
  nodes: ReviewRequest[]
}

export type PullRequest = {
  assignees: UserConnection
  author: GitHubUser
  title: string
  url: string
  comments: IssueCommentConnection
  createdAt: string
  updatedAt: string
  labels: IssueLabelEdge
  number: number
  participants: UserConnection
  additions: number
  deletions: number
  changedFiles: number
  isDraft: boolean
  reviews: PillRequestReviewConnection
  reviewRequests: ReviewRequestConnection
  viewerDidAuthor: boolean
  state: string
}

export type PullRequestEdge = {
  cursor?: string
  node: PullRequest
}

export type PullRequestConnection = {
  cursor?: string
  totalCount?: number
  edges: Array<PullRequestEdge>
}

export type GitActor = {
  user: GitHubUser
}

export type CommitNode = {
  additions: number
  author?: GitActor
  authoredDate: string
  changedFiles: number
  commitUrl: string
  committedDate: string
  committer?: GitActor
  deletions: number
  message: string
  pushedDate?: string
}

export type CommitHistoryConnection = {
  nodes: CommitNode[]
}

export type GitObject = {
  abbreviatedOid: string
  commitUrl: string
  history?: CommitHistoryConnection
}

export type Ref = {
  name: string
  target?: GitObject
}

export type ReleaseAssetConnection = {
  totalCount: number
}

export type Release = {
  author: GitHubUser
  createdAt: string
  isDraft: boolean
  // isLatest: boolean;
  isPrerelease: boolean
  name: string
  publishedAt: string
  releaseAssets: ReleaseAssetConnection
  tag?: Ref
  updatedAt: string
  url: string
}

export type ReleaseEdge = {
  cursor?: string
  node: Release
}

export type ReleaseConnection = {
  cursor?: string
  totalCount?: number
  edges: Array<ReleaseEdge>
}

export type GithubRepository = {
  issues?: IssueConnection
  pullRequests?: PullRequestConnection
  releases?: ReleaseConnection
  defaultBranchRef?: Ref
}

export type Repository = {
  repository?: GithubRepository
}
