import { createSignal, onMount, Show } from "solid-js";
import Card from "~/components/Card";

export default function TailwindSidebar() {
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  return (
    <main class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-[var(--color-base-content)]">
        Tailwind Sidebar Example
      </h1>

      <div class="grid grid-cols-1 gap-6">
        <Card title="Current Sidebar Implementation">
          <p class="text-[var(--color-base-content)] mb-4">
            This is the current sidebar implementation used in this application.
            It features a responsive design with mobile toggle functionality and
            keyboard navigation.
          </p>

          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <Show
              when={isMounted()}
              fallback={<p class="w-full h-96 border-0 rounded">loading...</p>}
            >
              <iframe
                src={window.location.origin}
                class="w-full h-96 border-0 rounded"
                title="Sidebar Example"
              />
            </Show>
          </div>

          <div class="mt-4 space-y-2">
            <h3 class="text-lg font-semibold text-[var(--color-base-content)]">
              Features:
            </h3>
            <ul class="list-disc list-inside text-[var(--color-base-content)] space-y-1">
              <li>Responsive design with mobile-first approach</li>
              <li>Keyboard navigation support (Ctrl+B to toggle)</li>
              <li>Dark mode compatible</li>
              <li>Smooth animations and transitions</li>
              <li>Accessible focus management</li>
              <li>Tree navigation with expandable sections</li>
            </ul>
          </div>
        </Card>

        <Card title="How to Use This in Your Own Project">
          <div class="text-[var(--color-base-content)] space-y-4">
            <div>
              <h4 class="font-semibold mb-2">1. Clone the Source</h4>
              <p class="mb-2">
                First, clone this repository to get access to the sidebar
                components.
              </p>
            </div>

            <div>
              <h4 class="font-semibold mb-2">2. Set up your app.tsx</h4>
              <p class="mb-2">
                Configure your main app file like this (see{" "}
                <a
                  href="https://docs.solidjs.com/solid-router/concepts/layouts"
                  class="text-blue-600 hover:underline"
                  target="_blank"
                >
                  SolidJS Router layouts documentation
                </a>
                ):
              </p>
              <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre class="text-sm">
                  <code>{`import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <Suspense>{props.children}</Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 class="font-semibold mb-2">3. Copy Required Files</h4>
              <p class="mb-2">Migrate the following files into your project:</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/components/Layout.tsx
                  </code>
                </li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/routes/Sidebar.tsx
                  </code>
                </li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/components/Nav.tsx
                  </code>
                </li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/components/NavTree.tsx
                  </code>
                </li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/utils/keybindings.ts
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">4. Copy Required Styles</h4>
              <p class="mb-2">Also copy these CSS files for proper styling:</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/styles/sidebar.css
                  </code>
                </li>
                <li>
                  <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    src/styles/wunderbaum.css
                  </code>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">5. Install Dependencies</h4>
              <p class="mb-2">
                Make sure you have the required dependencies installed:
              </p>
              <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre class="text-sm">
                  <code>pnpm add @solidjs/router solid-js</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 class="font-semibold mb-2">6. Create Layout Route</h4>
              <p class="mb-2">
                Create a layout route file similar to{" "}
                <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  src/routes/(layout).tsx
                </code>{" "}
                to wrap your pages with the sidebar layout.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Implementation Details">
          <div class="text-[var(--color-base-content)] space-y-4">
            <div>
              <h4 class="font-semibold">CSS Framework:</h4>
              <p>
                Built with Tailwind CSS for utility-first styling and responsive
                design.
              </p>
            </div>

            <div>
              <h4 class="font-semibold">Navigation Tree:</h4>
              <p>
                Uses Wunderbaum library for hierarchical navigation with custom
                styling.
              </p>
            </div>

            <div>
              <h4 class="font-semibold">Mobile Responsiveness:</h4>
              <p>
                Collapsible sidebar on mobile devices with overlay
                functionality.
              </p>
            </div>

            <div>
              <h4 class="font-semibold">Keyboard Shortcuts:</h4>
              <p>
                Ctrl+B toggles sidebar, Escape closes on mobile, vim-like
                navigation (h/j/k/l).
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
