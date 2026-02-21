import { useMemo } from "react";
import { useParams, Navigate, NavLink, Link } from "react-router-dom";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { blogPosts } from "../data/blogData";
import SEO from "../components/SEO";
import "./BlogPost.css";

const mdFiles = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractHeadings(markdown) {
  const headings = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: slugify(match[2]),
    });
  }
  return headings;
}

export default function BlogPost() {
  const { blogId, subpostId } = useParams();

  const blog = blogPosts.find((b) => b.id === blogId);

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  if (!subpostId) {
    return (
      <Navigate to={`/blog/${blogId}/${blog.subposts[0].id}`} replace />
    );
  }

  const currentSubpost = blog.subposts.find((s) => s.id === subpostId);

  if (!currentSubpost) {
    return (
      <Navigate to={`/blog/${blogId}/${blog.subposts[0].id}`} replace />
    );
  }

  const currentIndex = blog.subposts.findIndex((s) => s.id === subpostId);
  const prevSubpost = currentIndex > 0 ? blog.subposts[currentIndex - 1] : null;
  const nextSubpost =
    currentIndex < blog.subposts.length - 1
      ? blog.subposts[currentIndex + 1]
      : null;

  const mdKey = `/src/content/${blogId}/${subpostId}.md`;
  const markdown = mdFiles[mdKey] || "";

  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    author: { "@type": "Person", name: blog.author },
    datePublished: blog.date,
    url: `https://kboyanov19.netlify.app/blog/${blogId}/${subpostId}`,
  };

  return (
    <div className="post-page">
      <SEO
        title={`${currentSubpost.title} — ${blog.title}`}
        description={blog.excerpt}
        path={`/blog/${blogId}/${subpostId}`}
        type="article"
        jsonLd={blogPostJsonLd}
      />
      {/* Header */}
      <header className="post-header">
        <div className="post-header__left">
          <Link to="/blog" className="post-header__back">
            ~/blog
          </Link>
          <span className="post-header__sep">/</span>
          <h1 className="post-header__title">{blog.title}</h1>
        </div>
        <span className="post-header__subpost">{currentSubpost.title}</span>
      </header>

      {/* Holy Grail Body */}
      <div className="post-body">
        {/* Left Sidebar — Subpost Nav + Paragraph Map */}
        <aside className="post-sidebar-left">
          <div className="post-sidebar-left__panel">
            {/* Subpost Navigation */}
            <h2 className="post-sidebar__heading">chapters/</h2>
            <nav className="post-sidebar-left__nav">
              {blog.subposts.map((sp) => (
                <NavLink
                  key={sp.id}
                  to={`/blog/${blogId}/${sp.id}`}
                  className={({ isActive }) =>
                    `post-sidebar-left__link${isActive ? " post-sidebar-left__link--active" : ""}`
                  }
                >
                  {sp.title}
                </NavLink>
              ))}
            </nav>

            {/* Paragraph Map (Heading TOC) */}
            {headings.length > 0 && (
              <>
                <h2 className="post-sidebar__heading post-sidebar__heading--toc">
                  on this page/
                </h2>
                <nav className="post-sidebar-left__toc">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`post-sidebar-left__toc-link${h.level === 3 ? " post-sidebar-left__toc-link--nested" : ""}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </>
            )}
          </div>
        </aside>

        {/* Main Content — Rendered Markdown */}
        <main className="post-main">
          <div className="post-main__content">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
            >
              {markdown}
            </Markdown>
          </div>

          {/* Prev / Next Navigation */}
          <nav className="post-nav">
            {prevSubpost ? (
              <Link
                to={`/blog/${blogId}/${prevSubpost.id}`}
                className="post-nav__link post-nav__link--prev"
              >
                <span className="post-nav__arrow">&#8592;</span>
                <span className="post-nav__label">{prevSubpost.title}</span>
              </Link>
            ) : (
              <Link to="/blog" className="post-nav__link post-nav__link--prev">
                <span className="post-nav__arrow">&#8592;</span>
                <span className="post-nav__label">Back to blog</span>
              </Link>
            )}
            {nextSubpost ? (
              <Link
                to={`/blog/${blogId}/${nextSubpost.id}`}
                className="post-nav__link post-nav__link--next"
              >
                <span className="post-nav__label">{nextSubpost.title}</span>
                <span className="post-nav__arrow">&#8594;</span>
              </Link>
            ) : (
              <Link to="/blog" className="post-nav__link post-nav__link--next">
                <span className="post-nav__label">All posts</span>
                <span className="post-nav__arrow">&#8594;</span>
              </Link>
            )}
          </nav>
        </main>

        {/* Right Sidebar — Blog Map */}
        <aside className="post-sidebar-right">
          <div className="post-sidebar-right__panel">
            <h2 className="post-sidebar__heading">blog map/</h2>
            <ul className="post-sidebar-right__list">
              {blog.subposts.map((sp) => (
                <li
                  key={sp.id}
                  className={`post-sidebar-right__item${sp.id === subpostId ? " post-sidebar-right__item--active" : ""}`}
                >
                  <NavLink
                    to={`/blog/${blogId}/${sp.id}`}
                    className="post-sidebar-right__link"
                  >
                    {sp.title}
                  </NavLink>
                  <span className="post-sidebar-right__time">
                    {sp.readTime}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
