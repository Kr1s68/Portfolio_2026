import { useState, useEffect, useRef } from "react";

const GITHUB_API = "https://api.github.com";

/**
 * Supported event types and their human-readable descriptions.
 * Used internally for formatting — exported so consumers can
 * reference valid type keys when filtering.
 */
export const EVENT_TYPES = {
  PushEvent: "Pushed",
  PullRequestEvent: "Pull request",
  IssuesEvent: "Issue",
  CreateEvent: "Created",
  ForkEvent: "Forked",
  WatchEvent: "Starred",
  DeleteEvent: "Deleted",
  ReleaseEvent: "Released",
  IssueCommentEvent: "Commented on",
  PullRequestReviewEvent: "Reviewed",
};

/**
 * Returns common headers for GitHub API requests.
 * Includes auth token if available.
 */
function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) headers.Authorization = `bearer ${token}`;
  return headers;
}

/**
 * Fetches commit details for a PushEvent using the Compare API.
 * The Events API often returns PushEvent payloads without a commits
 * array — only `before` and `head` SHAs. This function resolves
 * the actual commits between those two refs.
 *
 * @param {string} repoName — full repo name (e.g. "Kr1s68/Portfolio_2026")
 * @param {string} before   — base SHA
 * @param {string} head     — head SHA
 * @param {AbortSignal} signal — abort signal for cleanup
 * @returns {Promise<{ count: number, messages: string[] }>}
 */
async function fetchPushCommits(repoName, before, head, signal) {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${repoName}/compare/${before}...${head}`,
      { headers: getHeaders(), signal },
    );

    if (!res.ok) return { count: 0, messages: [] };

    const data = await res.json();
    const commits = data.commits || [];

    return {
      count: commits.length,
      messages: commits.map((c) => c.commit.message),
    };
  } catch {
    return { count: 0, messages: [] };
  }
}

/**
 * Normalises a raw GitHub event into a flat, renderable object.
 * PushEvents are returned as partial objects (no title/details)
 * because they need async enrichment via the Compare API.
 *
 * @param {Object} raw — raw event from GitHub's /events API
 * @returns {{ id, type, repo, date, title?, details?, _push? } | null}
 */
function normaliseEvent(raw) {
  const base = {
    id: raw.id,
    type: raw.type,
    repo: raw.repo.name,
    date: raw.created_at,
  };

  switch (raw.type) {
    case "PushEvent": {
      const commits = raw.payload.commits || [];

      if (commits.length > 0) {
        /* Payload includes commits — use them directly */
        const count = raw.payload.size || commits.length;
        return {
          ...base,
          title: `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${base.repo}`,
          details: commits
            .filter((c) => c.distinct !== false)
            .map((c) => c.message),
        };
      }

      /* Payload missing commits — mark for async enrichment */
      return {
        ...base,
        title: null,
        details: [],
        _push: {
          before: raw.payload.before,
          head: raw.payload.head,
        },
      };
    }

    case "PullRequestEvent": {
      const pr = raw.payload.pull_request;
      const action = raw.payload.action;
      let verb;
      if (action === "opened") verb = "Opened";
      else if (action === "closed" && pr.merged) verb = "Merged";
      else verb = action.charAt(0).toUpperCase() + action.slice(1);

      return {
        ...base,
        title: `${verb} PR #${pr.number} in ${base.repo}`,
        details: [pr.title],
      };
    }

    case "IssuesEvent": {
      const issue = raw.payload.issue;
      return {
        ...base,
        title: `${raw.payload.action.charAt(0).toUpperCase() + raw.payload.action.slice(1)} issue #${issue.number} in ${base.repo}`,
        details: [issue.title],
      };
    }

    case "CreateEvent": {
      const refType = raw.payload.ref_type;
      const ref = raw.payload.ref;
      return {
        ...base,
        title: `Created ${refType}${ref ? ` "${ref}"` : ""} in ${base.repo}`,
        details: raw.payload.description ? [raw.payload.description] : [],
      };
    }

    case "ForkEvent":
      return {
        ...base,
        title: `Forked ${base.repo}`,
        details: [raw.payload.forkee?.full_name].filter(Boolean),
      };

    case "DeleteEvent":
      return {
        ...base,
        title: `Deleted ${raw.payload.ref_type} "${raw.payload.ref}" in ${base.repo}`,
        details: [],
      };

    case "ReleaseEvent":
      return {
        ...base,
        title: `Released ${raw.payload.release?.tag_name || "new version"} in ${base.repo}`,
        details: [raw.payload.release?.name].filter(Boolean),
      };

    case "IssueCommentEvent":
      return {
        ...base,
        title: `Commented on #${raw.payload.issue.number} in ${base.repo}`,
        details: [raw.payload.issue.title],
      };

    case "WatchEvent":
      return {
        ...base,
        title: `Starred ${base.repo}`,
        details: [],
      };

    case "PullRequestReviewEvent":
      return {
        ...base,
        title: `Reviewed PR #${raw.payload.pull_request.number} in ${base.repo}`,
        details: [raw.payload.pull_request.title],
      };

    default:
      return null;
  }
}

/**
 * Enriches PushEvents that are missing commit data by fetching
 * from the Compare API. Non-push events pass through unchanged.
 *
 * @param {Array}       events — normalised events (some with _push markers)
 * @param {AbortSignal} signal — abort signal for cleanup
 * @returns {Promise<Array>} — fully resolved events
 */
async function enrichPushEvents(events, signal) {
  return Promise.all(
    events.map(async (event) => {
      if (!event._push) return event;

      const { before, head } = event._push;
      const { count, messages } = await fetchPushCommits(
        event.repo,
        before,
        head,
        signal,
      );

      return {
        ...event,
        title: `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${event.repo}`,
        details: messages,
        _push: undefined,
      };
    }),
  );
}

/**
 * Fetches recent public GitHub activity for a user.
 *
 * Uses the REST API (`/users/{username}/events/public`) which works
 * without authentication (60 req/hr). If VITE_GITHUB_TOKEN is set,
 * it's included for higher rate limits (5000 req/hr).
 *
 * PushEvents that lack inline commit data are automatically enriched
 * via the Compare API (`/repos/{owner}/{repo}/compare/{base}...{head}`).
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
  const { limit = 30, eventTypes, perPage = 100 } = options;

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (!username) return;

    const cacheKey = `${username}-${limit}-${eventTypes?.join(",") || "all"}`;

    if (cacheRef.current[cacheKey]) {
      setEvents(cacheRef.current[cacheKey]);
      setStatus("success");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    fetch(`${GITHUB_API}/users/${username}/events/public?per_page=${perPage}`, {
      headers: getHeaders(),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`);
        return res.json();
      })
      .then((rawEvents) => {
        let normalised = rawEvents.map(normaliseEvent).filter(Boolean);

        if (eventTypes?.length) {
          normalised = normalised.filter((e) => eventTypes.includes(e.type));
        }

        return enrichPushEvents(normalised.slice(0, limit), controller.signal);
      })
      .then((enriched) => {
        cacheRef.current[cacheKey] = enriched;
        setEvents(enriched);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [username, limit, eventTypes, perPage]);

  return { events, status, error };
}
