import { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/global.css";
import App from "./App.jsx";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// If the page was prerendered, hydrate; otherwise mount fresh.
if (root.children.length > 0) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
