import { useState, useEffect, useRef } from 'react'

const GITHUB_EVENTS_URL = 'https://api.github.com/users'

/**
 * Supported event types and their human-readable descriptions.
 * Used internally for formatting — exported so consumers can
 * reference valid type keys when filtering.
 */
export const EVENT_TYPES = {
  PushEvent: 'Pushed',
  PullRequestEvent: 'Pull request',
  IssuesEvent: 'Issue',
  CreateEvent: 'Created',
  ForkEvent: 'Forked',
  WatchEvent: 'Starred',
  DeleteEvent: 'Deleted',
  ReleaseEvent: 'Released',
  IssueCommentEvent: 'Commented on',
  PullRequestReviewEvent: 'Reviewed',
}

/**
 * Normalises a raw GitHub event into a flat, renderable object.
 * Each event type has different payload shapes — this function
 * extracts the relevant fields into a consistent structure.
 *
 * @param {Object} raw — raw event from GitHub's /events API
 * @returns {{ id, type, repo, date, title, details: string[] } | null}
 */
function normaliseEvent(raw) {
  const base = {
    id: raw.id,
    type: raw.type,
    repo: raw.repo.name,
    date: raw.created_at,
  }

  switch (raw.type) {
    case 'PushEvent': {
      const commits = raw.payload.commits || []
      return {
        ...base,
        title: `Pushed ${commits.length} commit${commits.length !== 1 ? 's' : ''} to ${base.repo}`,
        details: commits.map((c) => c.message.split('\n')[0]),
      }
    }

    case 'PullRequestEvent': {
      const pr = raw.payload.pull_request
      return {
        ...base,
        title: `${raw.payload.action === 'opened' ? 'Opened' : raw.payload.action === 'closed' && pr.merged ? 'Merged' : raw.payload.action.charAt(0).toUpperCase() + raw.payload.action.slice(1)} PR #${pr.number} in ${base.repo}`,
        details: [pr.title],
      }
    }

    case 'IssuesEvent': {
      const issue = raw.payload.issue
      return {
        ...base,
        title: `${raw.payload.action.charAt(0).toUpperCase() + raw.payload.action.slice(1)} issue #${issue.number} in ${base.repo}`,
        details: [issue.title],
      }
    }

    case 'CreateEvent': {
      const refType = raw.payload.ref_type
      const ref = raw.payload.ref
      return {
        ...base,
        title: `Created ${refType}${ref ? ` "${ref}"` : ''} in ${base.repo}`,
        details: raw.payload.description ? [raw.payload.description] : [],
      }
    }

    case 'ForkEvent':
      return {
        ...base,
        title: `Forked ${base.repo}`,
        details: [raw.payload.forkee?.full_name].filter(Boolean),
      }

    case 'DeleteEvent':
      return {
        ...base,
        title: `Deleted ${raw.payload.ref_type} "${raw.payload.ref}" in ${base.repo}`,
        details: [],
      }

    case 'ReleaseEvent':
      return {
        ...base,
        title: `Released ${raw.payload.release?.tag_name || 'new version'} in ${base.repo}`,
        details: [raw.payload.release?.name].filter(Boolean),
      }

    case 'IssueCommentEvent':
      return {
        ...base,
        title: `Commented on #${raw.payload.issue.number} in ${base.repo}`,
        details: [raw.payload.issue.title],
      }

    case 'WatchEvent':
      return {
        ...base,
        title: `Starred ${base.repo}`,
        details: [],
      }

    case 'PullRequestReviewEvent':
      return {
        ...base,
        title: `Reviewed PR #${raw.payload.pull_request.number} in ${base.repo}`,
        details: [raw.payload.pull_request.title],
      }

    default:
      return null
  }
}

/**
 * Fetches recent public GitHub activity for a user.
 *
 * Uses the REST API (`/users/{username}/events/public`) which works
 * without authentication (60 req/hr). If VITE_GITHUB_TOKEN is set,
 * it's included for higher rate limits (5000 req/hr).
 *
 * @param {string}   username   — GitHub username
 * @param {Object}   [options]
 * @param {number}   [options.limit=30]       — max events to return
 * @param {string[]} [options.eventTypes]     — filter to these event types (e.g. ['PushEvent', 'PullRequestEvent'])
 * @param {number}   [options.perPage=100]    — events per API page (max 100)
 *
 * @returns {{
 *   events: Array<{ id, type, repo, date, title, details: string[] }>,
 *   status: 'idle' | 'loading' | 'success' | 'error',
 *   error: string | null
 * }}
 */
export function useGitHubActivity(username, options = {}) {
  const { limit = 30, eventTypes, perPage = 100 } = options

  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const cacheRef = useRef({})

  useEffect(() => {
    if (!username) return

    const cacheKey = `${username}-${limit}-${eventTypes?.join(',') || 'all'}`

    if (cacheRef.current[cacheKey]) {
      setEvents(cacheRef.current[cacheKey])
      setStatus('success')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setError(null)

    const headers = { 'Content-Type': 'application/json' }
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (token) headers.Authorization = `bearer ${token}`

    fetch(
      `${GITHUB_EVENTS_URL}/${username}/events/public?per_page=${perPage}`,
      { headers, signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`)
        return res.json()
      })
      .then((rawEvents) => {
        let normalised = rawEvents
          .map(normaliseEvent)
          .filter(Boolean)

        if (eventTypes?.length) {
          normalised = normalised.filter((e) => eventTypes.includes(e.type))
        }

        const result = normalised.slice(0, limit)
        cacheRef.current[cacheKey] = result
        setEvents(result)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [username, limit, eventTypes, perPage])

  return { events, status, error }
}
