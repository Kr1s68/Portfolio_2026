import { useState } from 'react'
import { useGitHubContributions } from '../../hooks/useGitHubContributions'
import './GitHubCalendar.css'

/**
 * Maps a contribution count to an intensity level (0–4)
 * relative to the maximum count in the dataset.
 *
 * @param {number} count    — contributions on a single day
 * @param {number} maxCount — highest daily count in the period
 * @returns {0 | 1 | 2 | 3 | 4}
 */
function getIntensityLevel(count, maxCount) {
  if (count === 0 || maxCount === 0) return 0
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/**
 * Scans the first day of each week to detect month boundaries.
 * Returns an array of { label, weekIndex } used for positioning month headers.
 *
 * @param {Array} weeks — weeks array from GitHub's contributionCalendar
 * @returns {Array<{ label: string, weekIndex: number }>}
 */
function getMonthLabels(weeks) {
  const labels = []
  let lastMonth = null

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0]
    if (!firstDay) return

    const month = new Date(firstDay.date).toLocaleString('en-US', {
      month: 'short',
    })

    if (month !== lastMonth) {
      labels.push({ label: month, weekIndex })
      lastMonth = month
    }
  })

  return labels
}

/** Day-of-week labels — only Mon / Wed / Fri to avoid clutter */
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

/**
 * GitHub contribution calendar heatmap.
 *
 * Fetches real contribution data from GitHub's GraphQL API and renders
 * an interactive grid of daily contribution cells, styled to match
 * the portfolio's terminal aesthetic.
 *
 * @param {Object}  props
 * @param {string}  props.username — GitHub username (default: "Kr1s68")
 * @param {string}  props.from     — ISO 8601 date string — period start
 * @param {string}  props.to       — ISO 8601 date string — period end
 */
export default function GitHubCalendar({
  username = 'Kr1s68',
  from,
  to,
}) {
  const { data, status, error } = useGitHubContributions(username, from, to)
  const [tooltip, setTooltip] = useState(null)

  /* ---------- Loading ---------- */
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="github-cal">
        <div className="github-cal__loading">
          <span className="github-cal__spinner">[ ]</span> Fetching
          contributions…
        </div>
      </div>
    )
  }

  /* ---------- Error ---------- */
  if (status === 'error') {
    return (
      <div className="github-cal">
        <div className="github-cal__error">
          [ERR] {error || 'Failed to load contribution data.'}
        </div>
      </div>
    )
  }

  /* ---------- Success ---------- */
  const { totalContributions, weeks } = data

  const allCounts = weeks.flatMap((w) =>
    w.contributionDays.map((d) => d.contributionCount),
  )
  const maxCount = Math.max(...allCounts, 1)
  const monthLabels = getMonthLabels(weeks)

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="github-cal">
      {/* Header */}
      <div className="github-cal__header">
        <span className="github-cal__total">
          {totalContributions} contributions
        </span>
        <span className="github-cal__period">
          {formatDate(from)} — {formatDate(to)}
        </span>
      </div>

      {/* Grid */}
      <div className="github-cal__grid-wrapper">
        {/* Month labels */}
        <div className="github-cal__months">
          <div className="github-cal__day-label-spacer" />
          {monthLabels.map((m, i) => {
            const prevEnd = i === 0 ? 0 : monthLabels[i - 1].weekIndex
            const offset = i === 0 ? m.weekIndex : m.weekIndex - prevEnd - 1
            return (
              <span
                key={i}
                className="github-cal__month"
                style={{ marginLeft: `calc(${offset} * var(--cal-col-size))` }}
              >
                {m.label}
              </span>
            )
          })}
        </div>

        <div className="github-cal__grid">
          {/* Day-of-week labels */}
          <div className="github-cal__day-labels">
            {DAY_LABELS.map((label, i) => (
              <span key={i} className="github-cal__day-label">
                {label}
              </span>
            ))}
          </div>

          {/* Contribution cells */}
          <div className="github-cal__cells">
            {weeks.map((week, wi) => (
              <div key={wi} className="github-cal__week">
                {week.contributionDays.map((day) => {
                  const level = getIntensityLevel(
                    day.contributionCount,
                    maxCount,
                  )
                  return (
                    <div
                      key={day.date}
                      className={`github-cal__cell github-cal__cell--level-${level}`}
                      onMouseEnter={() =>
                        setTooltip({
                          date: day.date,
                          count: day.contributionCount,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      aria-label={`${day.contributionCount} contributions on ${day.date}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip — rendered as static text below the grid */}
      <div className="github-cal__tooltip">
        {tooltip ? (
          <>
            <span className="github-cal__tooltip-count">
              {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}
            </span>
            {' on '}
            <span className="github-cal__tooltip-date">
              {new Date(tooltip.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </>
        ) : (
          <span className="github-cal__tooltip-hint">
            Hover over a cell to see details
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="github-cal__legend">
        <span className="github-cal__legend-label">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`github-cal__cell github-cal__cell--level-${level} github-cal__legend-cell`}
          />
        ))}
        <span className="github-cal__legend-label">More</span>
      </div>
    </div>
  )
}
