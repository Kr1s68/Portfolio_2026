import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        color: "var(--color-text-primary)",
        background: "var(--color-bg)",
        padding: "var(--space-8)",
        textAlign: "center",
      }}
    >
      <SEO
        title="404 — Page Not Found"
        description="This page doesn't exist."
        path="/404"
      />
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
        <span style={{ color: "var(--color-text-prompt)" }}>kristiyan@portfolio</span>
        <span style={{ color: "var(--color-text-secondary)" }}>:</span>
        <span>~</span>
        <span style={{ color: "var(--color-text-secondary)" }}>$ </span>
        cat page.txt
      </p>
      <h1 style={{ fontSize: "var(--font-size-2xl)", color: "var(--color-accent-error)", marginBottom: "var(--space-2)" }}>
        404: File not found
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          color: "var(--color-accent-primary)",
          textDecoration: "none",
          fontSize: "var(--font-size-sm)",
        }}
      >
        &#8592; cd ~
      </Link>
    </div>
  );
}
