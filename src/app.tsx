import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import "./app.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidJS Components</Title>
          <Meta
            name="description"
            content="A SolidJS components showcase application"
          />
          <Meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <Meta name="theme-color" content="#0f172a" />
          <Meta name="mobile-web-app-capable" content="yes" />
          <Meta name="apple-mobile-web-app-capable" content="yes" />
          <Meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <Meta
            name="apple-mobile-web-app-title"
            content="SolidJS Components"
          />
          <Link rel="manifest" href="/manifest.json" />
          <Link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <Link rel="apple-touch-icon" href="/icon-192x192.png" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
