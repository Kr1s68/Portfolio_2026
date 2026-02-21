import { useMemo } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import SEO from "../components/SEO";
import "./Blog.css";

export default function Blog() {
  const sortedPosts = useMemo(() => {
    return [...blogPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, []);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function totalReadTime(subposts) {
    const minutes = subposts.reduce((sum, sp) => {
      return sum + parseInt(sp.readTime, 10);
    }, 0);
    return `${minutes} min read`;
  }

  return (
    <div className="blog-page">
      <SEO
        title="Blog — Kristiyan Boyanov"
        description="Thoughts, lessons, and reflections from a full-stack developer in Vienna."
        path="/blog"
      />
      <header className="blog-header">
        <h1 className="blog-header__title">~/blog</h1>
        <span className="blog-header__count">
          {sortedPosts.length} post{sortedPosts.length !== 1 && "s"}
        </span>
      </header>

      <p className="blog-notice">Actual blogs coming soon.</p>

      <main className="blog-main">
        {sortedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="blog-card-link"
          >
            <article className="blog-card">
              <div className="blog-card__header">
                <h2 className="blog-card__title">{post.title}</h2>
                <div className="blog-card__meta">
                  <span className="blog-card__author">{post.author}</span>
                  <span className="blog-card__sep">&middot;</span>
                  <time className="blog-card__date" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className="blog-card__sep">&middot;</span>
                  <span className="blog-card__read-time">
                    {totalReadTime(post.subposts)}
                  </span>
                </div>
              </div>
              <div className="blog-card__tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="blog-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="blog-card__excerpt">{post.excerpt}</p>
            </article>
          </Link>
        ))}
      </main>

      <footer className="blog-footer">
        <Link to="/" className="blog-footer__back">
          &#8592; cd ~
        </Link>
      </footer>
    </div>
  );
}
