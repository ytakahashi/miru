import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const githubEndpoint = 'https://github.com'
const githubApiEndpoint = 'https://api.github.com/graphql'

export class GitHubUrl {
  #url: URL;
  #apiEndpoint: string;

  static from = (url?: string): GitHubUrl|undefined => {
    try {
      const urlObject = url ? new URL(url) : new URL(githubEndpoint)
      const apiEndpoint = urlObject.origin === githubEndpoint ? githubApiEndpoint : `${urlObject.origin}/api/graphql`
      return new GitHubUrl(urlObject.origin, apiEndpoint)
    } catch (e) {
      return undefined
    }
  }

  constructor (url: string, apiEndpoint: string) {
    this.#url = new URL(url)
    this.#apiEndpoint = apiEndpoint
  }

  getUrl = (): string => {
    return this.#url.origin
  }

  getApiEndpoint = (): string => {
    return this.#apiEndpoint
  }

  getDomain = (): string => {
    return this.#url.host
  }

  isEnterprise = (): boolean => {
    return this.#url.origin !== githubEndpoint
  }
}

export class Account {
  public readonly userName: string;
  public readonly profileUrl: string;
  public readonly avatarUrl: string;
  public readonly githubUrl: GitHubUrl;
  public readonly personalAccessToken: string;

  constructor (
    userName: string,
    profileUrl: string,
    avatarUrl: string,
    githubUrl: GitHubUrl,
    personalAccessToken: string
  ) {
    this.userName = userName
    this.profileUrl = profileUrl
    this.avatarUrl = avatarUrl
    this.githubUrl = githubUrl
    this.personalAccessToken = personalAccessToken
  }

  getId = (): string => {
    return `${this.userName}.${this.githubUrl.getDomain()}`
  }
}

export class Label {
  public readonly name: string;
  public readonly color: string;
  constructor (name: string, color: string) {
    this.name = name
    this.color = color
  }
}

export class Issue {
  public readonly authorName: string;
  public readonly issueNumber: number;
  public readonly title: string;
  public readonly url: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly labels: Array<Label>;
  public readonly numberOfComments: number;
  public readonly numberOfParticipants: number;

  constructor (
    authorName: string,
    issueNumber: number,
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    labels: Array<Label>,
    numberOfComments: number,
    numberOfParticipants: number
  ) {
    this.authorName = authorName
    this.issueNumber = issueNumber
    this.title = title
    this.url = url
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.labels = labels
    this.numberOfComments = numberOfComments
    this.numberOfParticipants = numberOfParticipants
  }

  getCreatedRelativeDate = (): string => {
    return dayjs(this.createdAt).fromNow()
  }

  getUpdatedRelativeDate = (): string => {
    return dayjs(this.updatedAt).fromNow()
  }
}

export class Issues {
  readonly #lastUpdatedAt: number
  public readonly issues: Array<Issue>;
  public readonly totalCount?: number;

  constructor (
    issues: Array<Issue>,
    totalCount?: number
  ) {
    this.#lastUpdatedAt = dayjs().unix()
    this.issues = issues
    this.totalCount = totalCount
  }
}

export class PullRequest extends Issue {
  public readonly additions: number;
  public readonly deletions: number;
  public readonly changedFiles: number;
  public readonly isDraft: boolean;

  constructor (
    authorName: string,
    issueNumber: number,
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    labels: Array<Label>,
    numberOfComments: number,
    numberOfParticipants: number,
    additions: number,
    deletions: number,
    changedFiles: number,
    isDraft: boolean
  ) {
    super(
      authorName,
      issueNumber,
      title,
      url,
      createdAt,
      updatedAt,
      labels,
      numberOfComments,
      numberOfParticipants
    )
    this.additions = additions
    this.deletions = deletions
    this.changedFiles = changedFiles
    this.isDraft = isDraft
  }
}

export class PullRequests {
  readonly #lastUpdatedAt: number
  public readonly pullRequests: Array<PullRequest>;
  public readonly totalCount?: number;

  constructor (
    pullRequests: Array<PullRequest>,
    totalCount?: number
  ) {
    this.#lastUpdatedAt = dayjs().unix()
    this.pullRequests = pullRequests
    this.totalCount = totalCount
  }
}
