import { useState, useEffect, useRef } from 'react'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

/**
 * GraphQL query for GitHub's contribution calendar.
 * Returns daily contribution counts grouped by week, plus the total.
 *
 * Variables:
 *   $username — GitHub login (e.g. "Kr1s68")
 *   $from     — ISO 8601 start date (e.g. "2025-01-01T00:00:00Z")
 *   $to       — ISO 8601 end date   (e.g. "2026-01-01T00:00:00Z")
 */
const QUERY = `
  query ($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`

/**
 * Fetches GitHub contribution calendar data for a given user and time range.
 *
 * @param {string} username — GitHub username
 * @param {string} from    — ISO 8601 date string (period start)
 * @param {string} to      — ISO 8601 date string (period end)
 *
 * @returns {{
 *   data: {
 *     totalContributions: number,
 *     weeks: Array<{
 *       contributionDays: Array<{
 *         contributionCount: number,
 *         date: string,
 *         color: string
 *       }>
 *     }>
 *   } | null,
 *   status: 'idle' | 'loading' | 'success' | 'error',
 *   error: string | null
 * }}
 */
export function useGitHubContributions(username, from, to) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const cacheRef = useRef({})

  useEffect(() => {
    if (!username || !from || !to) return

    const cacheKey = `${username}-${from}-${to}`

    if (cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey])
      setStatus('success')
      return
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN

    if (!token) {
      setStatus('error')
      setError('GitHub token not configured. Set VITE_GITHUB_TOKEN in .env.local')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setError(null)

    fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username, from, to },
      }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (json.errors) throw new Error(json.errors[0].message)

        const calendar =
          json.data.user.contributionsCollection.contributionCalendar

        cacheRef.current[cacheKey] = calendar
        setData(calendar)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [username, from, to])

  return { data, status, error }
}
