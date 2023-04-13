import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import tinycolor from 'tinycolor2'
import { RepositorySetting } from '@/application/domain/model/githubRepository'

dayjs.extend(relativeTime)
dayjs.extend(utc)

const githubEndpoint = 'https://github.com'
const githubApiEndpoint = 'https://api.github.com/graphql'

export class GitHubUrl {
  #url: URL
  #apiEndpoint: string

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
  public readonly userName: string
  public readonly profileUrl: string
  public readonly avatarUrl: string
  public readonly githubUrl: GitHubUrl
  public readonly personalAccessToken: string

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
  public readonly name: string
  public readonly color: string
  public readonly isLight: boolean

  constructor (name: string, color: string) {
    this.name = name
    const t = tinycolor(color)
    this.color = t.toHexString()
    this.isLight = t.isLight()
  }
}

export class BaseContent {
  public readonly authorName: string
  public readonly title: string
  public readonly url: string
  public readonly createdAt: string
  public readonly updatedAt: string

  constructor (
    authorName: string,
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.authorName = authorName
    this.title = title
    this.url = url
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  getCreatedRelativeDate = (): string => {
    return dayjs(this.createdAt).fromNow()
  }

  getUpdatedRelativeDate = (): string => {
    return dayjs(this.updatedAt).fromNow()
  }

  getCreatedLocalDate = (): string => {
    return dayjs(this.createdAt).local().format('YYYY-MM-DD HH:mm:ssZ')
  }

  getUpdatedLocalDate = (): string => {
    return dayjs(this.updatedAt).local().format('YYYY-MM-DD HH:mm:ssZ')
  }
}

export class Issue extends BaseContent {
  public readonly issueNumber: number
  public readonly labels: Array<Label>
  public readonly numberOfComments: number
  public readonly numberOfParticipants: number
  public readonly isAssigned: boolean
  public readonly viewerDidAuthor: boolean

  constructor (
    authorName: string,
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    issueNumber: number,
    labels: Array<Label>,
    numberOfComments: number,
    numberOfParticipants: number,
    isAssigned: boolean,
    viewerDidAuthor: boolean
  ) {
    super(
      authorName,
      title,
      url,
      createdAt,
      updatedAt
    )
    this.issueNumber = issueNumber
    this.labels = labels
    this.numberOfComments = numberOfComments
    this.numberOfParticipants = numberOfParticipants
    this.isAssigned = isAssigned
    this.viewerDidAuthor = viewerDidAuthor
  }
}

export class TagReference {
  public readonly abbreviatedObjectId: string
  public readonly commitUrl: string

  constructor (
    abbreviatedObjectId: string,
    commitUrl: string
  ) {
    this.abbreviatedObjectId = abbreviatedObjectId
    this.commitUrl = commitUrl
  }
}
export class Release extends BaseContent {
  public readonly isDraft: boolean
  public readonly isPrerelease: boolean
  public readonly releaseAssetCount: number
  public readonly tagName?: string
  public readonly tag?: TagReference

  constructor (
    authorName: string,
    name: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    isDraft: boolean,
    isPrerelease: boolean,
    releaseAssetCount: number,
    tagName?: string,
    tag?: TagReference
  ) {
    super(
      authorName,
      name,
      url,
      createdAt,
      updatedAt
    )
    this.isDraft = isDraft
    this.isPrerelease = isPrerelease
    this.releaseAssetCount = releaseAssetCount
    this.tagName = tagName
    this.tag = tag
  }
}

export class PullRequestReviews {
  public readonly reviewCount: number
  public readonly hasRemainedItem: boolean

  constructor (
    reviewCount: number,
    hasRemainedItem: boolean
  ) {
    this.reviewCount = reviewCount
    this.hasRemainedItem = hasRemainedItem
  }
}
export class PullRequest extends BaseContent {
  public readonly issueNumber: number
  public readonly labels: Array<Label>
  public readonly numberOfComments: number
  public readonly numberOfParticipants: number
  public readonly additions: number
  public readonly deletions: number
  public readonly changedFiles: number
  public readonly isDraft: boolean
  public readonly reviews: PullRequestReviews
  public readonly isAssigned: boolean
  public readonly isReviewRequested: boolean
  public readonly viewerDidAuthor: boolean

  constructor (
    authorName: string,
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    issueNumber: number,
    labels: Array<Label>,
    numberOfComments: number,
    numberOfParticipants: number,
    additions: number,
    deletions: number,
    changedFiles: number,
    isDraft: boolean,
    reviews: PullRequestReviews,
    isAssigned: boolean,
    isReviewRequested: boolean,
    viewerDidAuthor: boolean
  ) {
    super(
      authorName,
      title,
      url,
      createdAt,
      updatedAt
    )
    this.issueNumber = issueNumber
    this.labels = labels
    this.numberOfComments = numberOfComments
    this.numberOfParticipants = numberOfParticipants

    this.additions = additions
    this.deletions = deletions
    this.changedFiles = changedFiles
    this.isDraft = isDraft
    this.reviews = reviews
    this.isAssigned = isAssigned
    this.isReviewRequested = isReviewRequested
    this.viewerDidAuthor = viewerDidAuthor
  }
}

export class Commit {
  public readonly message: string
  public readonly commitUrl: string
  public readonly additions: number
  public readonly deletions: number
  public readonly changedFiles: number
  public readonly authorName?: string
  public readonly authoredDate: string
  public readonly committerName? :string
  public readonly committedDate: string
  public readonly pushedDate?: string

  constructor (
    message: string,
    commitUrl: string,
    additions: number,
    deletions: number,
    changedFiles: number,
    authorName: string | undefined,
    authoredDate: string,
    committerName :string | undefined,
    committedDate: string,
    pushedDate: string | undefined
  ) {
    this.message = message
    this.commitUrl = commitUrl
    this.additions = additions
    this.deletions = deletions
    this.changedFiles = changedFiles
    this.authorName = authorName
    this.authoredDate = authoredDate
    this.committerName = committerName
    this.committedDate = committedDate
    this.pushedDate = pushedDate
  }

  getPushedRelativeDate = (): string => {
    return this.pushedDate === undefined
      ? ''
      : dayjs(this.pushedDate).fromNow()
  }

  getAuthoredRelativeDate = (): string => {
    return dayjs(this.authoredDate).fromNow()
  }

  getCommittedRelativeDate = (): string => {
    return dayjs(this.committedDate).fromNow()
  }

  getPushedLocalDate = (): string => {
    return this.pushedDate === undefined
      ? ''
      : dayjs(this.pushedDate).local().format('YYYY-MM-DD HH:mm:ssZ')
  }

  getAuthoredLocalDate = (): string => {
    return dayjs(this.authoredDate).local().format('YYYY-MM-DD HH:mm:ssZ')
  }

  getCommittedLocalDate = (): string => {
    return dayjs(this.committedDate).local().format('YYYY-MM-DD HH:mm:ssZ')
  }

  public getAuthorInformation = (): string => {
    let text = ''
    if (this.authorName !== undefined) {
      text += this.authorName + ' '
    }
    text += 'authored ' + this.getAuthoredRelativeDate()
    return text
  }

  public getCommitInformation = (): string => {
    let text = ''
    if (this.committerName !== undefined) {
      text += this.committerName + ' '
    }
    text += 'committed ' + this.getCommittedRelativeDate()
    return text
  }
}

class ResultListHolder<T> {
  readonly fetchedAt: number
  public readonly repositoryUrl: string
  public readonly results: Array<T>
  public readonly totalCount?: number

  constructor (
    repositorySetting: RepositorySetting,
    results: Array<T>,
    totalCount?: number
  ) {
    this.fetchedAt = dayjs().unix()
    this.repositoryUrl = repositorySetting.getUrl()
    this.results = results
    this.totalCount = totalCount
  }

  fetchedAtDate = (): string => {
    return dayjs.unix(this.fetchedAt).format('YYYY-MM-DD HH:mm:ss')
  }

  belongsTo = (url: string): boolean => {
    return this.repositoryUrl === url
  }

  hasContents = (): boolean => {
    return this.results.length !== 0
  }
}

export class Issues extends ResultListHolder<Issue> {
}

export class PullRequests extends ResultListHolder<PullRequest> {
}

export class Releases extends ResultListHolder<Release> {
}

export class CommitHistory extends ResultListHolder<Commit> {
}
