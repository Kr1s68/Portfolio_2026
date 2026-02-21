import { StrictMode } from "react";
import { StaticRouter } from "react-router";
import App from "./App.jsx";

/**
 * Document shell for prerendering.
 * Base <head> elements live here; per-page <title>, <meta>, and JSON-LD
 * are rendered by the <SEO> component inside each page and React 19
 * hoists them into <head> during server rendering.
 */
export function Document({ url, cssPath }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/space_invader_no_background.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Kristiyan Boyanov" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {cssPath && <link rel="stylesheet" href={cssPath} />}
      </head>
      <body>
        <div id="root">
          <StrictMode>
            <StaticRouter location={url}>
              <App />
            </StaticRouter>
          </StrictMode>
        </div>
      </body>
    </html>
  );
}
