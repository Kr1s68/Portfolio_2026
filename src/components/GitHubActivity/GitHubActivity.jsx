import { useMemo } from "react";
import { useGitHubActivity, EVENT_TYPES } from "../../hooks/useGitHubActivity";
import "./GitHubActivity.css";

/**
 * Parses inline markdown into React elements.
 * Handles: ***bold italic***, **bold**, *italic*, `code`, ~~strikethrough~~
 *
 * @param {string} text — raw markdown string (single line)
 * @returns {Array<string | JSX.Element>}
 */
function parseInlineMarkdown(text) {
  if (!text) return [text];

  const tokens = [];
  let remaining = text;
  let key = 0;

  /* Pattern order matters — longest/most specific first */
  const patterns = [
    {
      regex: /\*\*\*(.+?)\*\*\*/,
      tag: "strong",
      className: "gh-activity__md-bold-italic",
      italic: true,
    },
    {
      regex: /\*\*(.+?)\*\*/,
      tag: "strong",
      className: "gh-activity__md-bold",
    },
    { regex: /\*(.+?)\*/, tag: "em", className: "gh-activity__md-italic" },
    { regex: /```(.+?)```/, tag: "code", className: "gh-activity__md-code" },
    { regex: /~~(.+?)~~/, tag: "s", className: "gh-activity__md-strike" },
  ];

  while (remaining.length > 0) {
    let earliest = null;
    let matchedPattern = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && (earliest === null || match.index < earliest.index)) {
        earliest = match;
        matchedPattern = pattern;
      }
    }

    if (!earliest || !matchedPattern) {
      tokens.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      tokens.push(remaining.slice(0, earliest.index));
    }

    const Tag = matchedPattern.tag;
    const inner = earliest[1];

    if (matchedPattern.italic) {
      tokens.push(
        <Tag key={key++} className={matchedPattern.className}>
          <em>{inner}</em>
        </Tag>,
      );
    } else {
      tokens.push(
        <Tag key={key++} className={matchedPattern.className}>
          {inner}
        </Tag>,
      );
    }

    remaining = remaining.slice(earliest.index + earliest[0].length);
  }

  return tokens;
}

/**
 * Maps event types to short terminal-style prefixes.
 * These appear before each entry for quick visual scanning.
 */
const TYPE_PREFIXES = {
  PushEvent: "PUSH",
  PullRequestEvent: "PR",
  IssuesEvent: "ISSUE",
  CreateEvent: "NEW",
  ForkEvent: "FORK",
  WatchEvent: "STAR",
  DeleteEvent: "DEL",
  ReleaseEvent: "REL",
  IssueCommentEvent: "COMMENT",
  PullRequestReviewEvent: "REVIEW",
};

/**
 * Maps event types to CSS modifier suffixes for colour coding.
 *
 * Modifiers reference BEM classes like:
 *   .gh-activity__tag--push
 *   .gh-activity__tag--pr
 *
 * Override colours in the CSS file to restyle.
 */
const TYPE_MODIFIERS = {
  PushEvent: "push",
  PullRequestEvent: "pr",
  IssuesEvent: "issue",
  CreateEvent: "create",
  ForkEvent: "fork",
  WatchEvent: "star",
  DeleteEvent: "delete",
  ReleaseEvent: "release",
  IssueCommentEvent: "comment",
  PullRequestReviewEvent: "review",
};

/**
 * Formats an ISO date string into a compact terminal-style date.
 * e.g. "2026-02-15T10:30:00Z" → "Feb 15"
 *      or "2025-12-01T..." → "Dec 01, 2025" (if different year)
 *
 * @param {string} iso — ISO 8601 date string
 * @returns {string}
 */
function formatDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/**
 * Groups events by date (day string) for a cleaner timeline view.
 *
 * @param {Array} events — normalised events from the hook
 * @returns {Array<{ date: string, label: string, events: Array }>}
 */
function groupByDate(events) {
  const groups = [];
  let currentKey = null;

  for (const event of events) {
    const dayKey = event.date.slice(0, 10);
    if (dayKey !== currentKey) {
      currentKey = dayKey;
      groups.push({ date: dayKey, label: formatDate(event.date), events: [] });
    }
    groups[groups.length - 1].events.push(event);
  }

  return groups;
}

/**
 * GitHub activity feed — renders recent public events as a
 * terminal-style log grouped by date.
 *
 * Works without authentication (public events API, 60 req/hr).
 * If VITE_GITHUB_TOKEN is set, uses it for higher rate limits.
 *
 * @param {Object}   props
 * @param {string}   props.username       — GitHub username (default: "Kr1s68")
 * @param {number}   [props.limit=30]     — max events to display
 * @param {string[]} [props.eventTypes]   — filter to specific event types (keys from EVENT_TYPES)
 * @param {boolean}  [props.showDetails=true]  — show commit messages / PR titles under each event
 * @param {boolean}  [props.groupByDay=true]   — group events under date headers
 * @param {string}   [props.className]    — additional CSS class for the root element
 */
export default function GitHubActivity({
  username = "Kr1s68",
  limit = 30,
  eventTypes,
  showDetails = true,
  groupByDay = true,
  className = "",
}) {
  const { events, status, error } = useGitHubActivity(username, {
    limit,
    eventTypes,
  });

  const grouped = useMemo(
    () => (groupByDay ? groupByDate(events) : null),
    [events, groupByDay],
  );

  /* ---------- Loading ---------- */
  if (status === "loading" || status === "idle") {
    return (
      <div className={`gh-activity ${className}`}>
        <div className="gh-activity__loading">
          <span className="gh-activity__spinner">[ ]</span> Fetching activity…
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (status === "error") {
    return (
      <div className={`gh-activity ${className}`}>
        <div className="gh-activity__error">
          [ERR] {error || "Failed to load activity data."}
        </div>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (events.length === 0) {
    return (
      <div className={`gh-activity ${className}`}>
        <div className="gh-activity__empty">No recent activity found.</div>
      </div>
    );
  }

  /* ---------- Grouped view ---------- */
  if (groupByDay && grouped) {
    return (
      <div className={`gh-activity ${className}`}>
        <div className="gh-activity__header">
          <span className="gh-activity__count">
            Last {events.length} events
          </span>
          <span className="gh-activity__user">@{username}</span>
        </div>

        <div className="gh-activity__timeline">
          {grouped.map((group) => (
            <div key={group.date} className="gh-activity__day">
              <div className="gh-activity__date">{group.label}</div>
              <div className="gh-activity__entries">
                {group.events.map((event) => (
                  <ActivityEntry
                    key={event.id}
                    event={event}
                    showDetails={showDetails}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Flat view ---------- */
  return (
    <div className={`gh-activity ${className}`}>
      <div className="gh-activity__header">
        <span className="gh-activity__count">{events.length} events</span>
        <span className="gh-activity__user">@{username}</span>
      </div>

      <div className="gh-activity__entries">
        {events.map((event) => (
          <ActivityEntry
            key={event.id}
            event={event}
            showDetails={showDetails}
            showDate
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Renders a multi-line commit message with proper line breaks
 * and markdown list item support.
 *
 * Lines starting with "- " are rendered as list items with a bullet.
 * All other non-empty lines are rendered as plain text with inline markdown.
 * Empty lines are collapsed into spacing between blocks.
 *
 * @param {string} text — full commit message (may contain \n)
 * @param {number} baseKey — key offset for React elements
 * @returns {Array<JSX.Element>}
 */
function renderDetailLines(text, baseKey) {
  const lines = text.split("\n");
  const elements = [];
  let key = baseKey;

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;

    if (trimmed.startsWith("- ")) {
      elements.push(
        <span key={key++} className="gh-activity__detail-line gh-activity__detail-line--list">
          {parseInlineMarkdown(trimmed.slice(2))}
        </span>,
      );
    } else {
      elements.push(
        <span key={key++} className="gh-activity__detail-line">
          {parseInlineMarkdown(trimmed)}
        </span>,
      );
    }
  }

  return elements;
}

/**
 * Single activity entry — renders one event with optional details.
 * Extracted as a separate component for reuse and readability.
 *
 * @param {Object}  props
 * @param {Object}  props.event       — normalised event object
 * @param {boolean} props.showDetails — whether to render detail lines
 * @param {boolean} [props.showDate]  — show inline date (for flat view)
 */
function ActivityEntry({ event, showDetails, showDate = false }) {
  const modifier = TYPE_MODIFIERS[event.type] || "default";
  const prefix = TYPE_PREFIXES[event.type] || "EVENT";

  return (
    <div className="gh-activity__entry">
      <div className="gh-activity__entry-header">
        <span className={`gh-activity__tag gh-activity__tag--${modifier}`}>
          [{prefix}]
        </span>
        <span className="gh-activity__title">{event.title}</span>
        {showDate && (
          <span className="gh-activity__inline-date">
            {formatDate(event.date)}
          </span>
        )}
      </div>

      {showDetails && event.details.length > 0 && (
        <ul className="gh-activity__details">
          {event.details.map((detail, i) => (
            <li key={i} className="gh-activity__detail">
              {renderDetailLines(detail, i * 1000)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Re-export for consumers who want to reference valid types */
export { EVENT_TYPES };
