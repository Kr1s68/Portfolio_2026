import { createElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");

const ROUTES = [
  "/",
  "/blog",
  "/blog/2025-a-year-full-of-lessons-blog/introduction",
  "/blog/2025-a-year-full-of-lessons-blog/lesson-1-you're-worth-loving",
];

async function streamToString(nodeStream) {
  return new Promise((resolve, reject) => {
    let html = "";
    nodeStream.on("data", (chunk) => (html += chunk));
    nodeStream.on("end", () => resolve(html));
    nodeStream.on("error", reject);
  });
}

async function run() {
  // 1. Import the Vite-built server entry
  const ssrEntry = pathToFileURL(
    join(projectRoot, "dist-ssr", "entry-static.js")
  ).href;
  const { Document } = await import(ssrEntry);

  // 2. Extract hashed asset paths from the client build
  const indexHtml = await readFile(join(distDir, "index.html"), "utf-8");
  const jsMatch = indexHtml.match(/src="(\/assets\/[^"]+\.js)"/);
  const cssMatch = indexHtml.match(/href="(\/assets\/[^"]+\.css)"/);
  const jsPath = jsMatch?.[1];
  const cssPath = cssMatch?.[1];

  if (!jsPath) {
    console.error("Could not find JS bundle path in dist/index.html");
    process.exit(1);
  }

  console.log(`JS bundle:  ${jsPath}`);
  console.log(`CSS bundle: ${cssPath || "(none)"}`);
  console.log(`Routes:     ${ROUTES.length}\n`);

  // 3. Prerender each route
  for (const route of ROUTES) {
    const element = createElement(Document, { url: route, cssPath });

    const { prelude } = await prerenderToNodeStream(element, {
      bootstrapModules: [jsPath],
    });

    const html = await streamToString(prelude);

    // Write to dist/<route>/index.html (or dist/index.html for "/")
    const filePath =
      route === "/"
        ? join(distDir, "index.html")
        : join(distDir, ...route.split("/").filter(Boolean), "index.html");

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, html);
    console.log(`  prerendered: ${route}`);
  }

  console.log("\nDone.");
}

run().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
