import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

try {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }

  const convex = new ConvexReactClient(convexUrl);

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </ErrorBoundary>
  );
} catch (error: any) {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0F0F0F; color: #D9D9D9; font-family: 'IBM Plex Mono', monospace; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #ff4444; margin-bottom: 20px; font-size: 24px;">⚠️ Application Error</h1>
          <p style="margin-bottom: 10px;">${error?.message || "Failed to load application"}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">Check the browser console for details</p>
          <button
            onclick="window.location.reload()"
            style="margin-top: 20px; padding: 10px 20px; background: #2E2E2E; border: 1px solid #444; color: #D9D9D9; cursor: pointer; font-family: monospace;"
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
  console.error("Application initialization error:", error);
}
