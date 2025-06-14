import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import "./app.css";

// Constants
const SIDEBAR_CONFIG = {
  DEFAULT_WIDTH: 280,
  MIN_WIDTH: 220,
  MAX_WIDTH: 400,
  MOBILE_BREAKPOINT: 768,
  NAVIGATION_ITEMS_COUNT: 15,
} as const;

export default function Home() {
  // State
  const [sidebarWidth, setSidebarWidth] = createSignal<number>(
    SIDEBAR_CONFIG.DEFAULT_WIDTH,
  );
  const [isResizing, setIsResizing] = createSignal<boolean>(false);
  const [isMobile, setIsMobile] = createSignal<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = createSignal<boolean>(true);
  const [mobileExpanded, setMobileExpanded] = createSignal<boolean>(false);

  // Event handlers
  const handleResizeStart = (e: MouseEvent): void => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeMove = (e: MouseEvent): void => {
    if (!isResizing()) return;

    const newWidth = Math.max(
      SIDEBAR_CONFIG.MIN_WIDTH,
      Math.min(SIDEBAR_CONFIG.MAX_WIDTH, e.clientX),
    );
    setSidebarWidth(newWidth);
  };

  const handleResizeEnd = (): void => {
    setIsResizing(false);
  };

  const checkIfMobile = (): void => {
    setIsMobile(window.innerWidth < SIDEBAR_CONFIG.MOBILE_BREAKPOINT);
  };

  const toggleSidebar = (): void => {
    setSidebarVisible(!sidebarVisible());
  };

  const toggleMobileExpansion = (): void => {
    setMobileExpanded(!mobileExpanded());
  };

  // Effects and lifecycle
  onMount(() => {
    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);

    onCleanup(() => {
      window.removeEventListener("resize", checkIfMobile);
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    });
  });

  // Computed values
  const sidebarWidthStyle = (): string =>
    isMobile() ? "100%" : `${sidebarWidth()}px`;

  const resizeHandleColor = (): string =>
    isResizing() ? "#3b82f6" : "#4b5563";

  return (
    <div class="flex flex-col h-screen bg-gray-900">
      {/* Header - Title Bar Style */}
      <header class="bg-gray-800 border-b border-gray-700">
        <div class="flex items-center justify-between px-4 py-2">
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">W</span>
            </div>
            <h1 class="text-sm font-medium text-gray-200">WikiDocs</h1>
          </div>
          <button
            onClick={toggleSidebar}
            class="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            type="button"
          >
            {sidebarVisible() ? "Hide Panel" : "Show Panel"}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div class="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <Show when={sidebarVisible()}>
          <aside
            class={`w-full md:flex bg-gray-800 border-r border-gray-700 flex-col relative md:overflow-visible ${
              !sidebarVisible() ? "hidden" : ""
            }`}
            style={{ width: sidebarWidthStyle() }}
          >
            {/* Mobile accordion header */}
            <div
              class={`md:hidden bg-gray-750 border-b border-gray-700 p-3 cursor-pointer flex items-center justify-between transition-all ${
                mobileExpanded() ? "" : ""
              }`}
              onClick={toggleMobileExpansion}
            >
              <h2 class="text-sm font-medium text-gray-200">
                Explorer
              </h2>
              <svg
                class={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  mobileExpanded() ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Desktop header */}
            <div class="hidden md:block border-b border-gray-700 p-3">
              <h2 class="text-sm font-medium text-gray-200 uppercase tracking-wide">
                Explorer
              </h2>
            </div>

            {/* Navigation content */}
            <div
              class={`${
                isMobile() ? (mobileExpanded() ? "block" : "hidden") : "flex-1"
              } ${
                isMobile()
                  ? "max-h-96 overflow-y-auto bg-gray-800"
                  : "overflow-y-auto"
              }`}
            >
              <nav class="flex-1">
                <ul class={`${isMobile() ? "p-2" : "p-2"}`}>
                  <For
                    each={Array.from(
                      { length: SIDEBAR_CONFIG.NAVIGATION_ITEMS_COUNT },
                      (_, i) => i + 1,
                    )}
                  >
                    {(itemNumber) => (
                      <li class="mb-0.5">
                        <a
                          href="#"
                          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-sm transition-colors flex items-center"
                        >
                          <span class="mr-2 text-xs">
                            {itemNumber <= 3
                              ? "📄"
                              : itemNumber <= 6
                                ? "📁"
                                : "📋"}
                          </span>
                          {itemNumber <= 3
                            ? `Getting Started ${itemNumber}`
                            : itemNumber <= 6
                              ? `Documentation ${itemNumber - 3}`
                              : itemNumber <= 9
                                ? `API Reference ${itemNumber - 6}`
                                : `Advanced Topics ${itemNumber - 9}`}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </nav>
            </div>

            {/* Desktop resize handle */}
            <div
              class="absolute top-0 right-0 w-1 h-full bg-gray-600 hover:bg-blue-500 cursor-col-resize hidden md:block transition-colors"
              onMouseDown={handleResizeStart}
              style={{ "background-color": resizeHandleColor() }}
            />
          </aside>
        </Show>

        {/* Main content */}
        <main class="flex-1 bg-gray-900 overflow-y-auto">
          <div class="max-w-4xl mx-auto p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-100 mb-2">
                Welcome to WikiDocs
              </h1>
              <p class="text-gray-400">
                A modern documentation platform with resizable navigation
              </p>
            </div>

            <div class="max-w-none">
              <h2 class="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
                Overview
              </h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                This is a demonstration of a modern wiki-style interface built
                with SolidJS and Tailwind CSS. The sidebar can be resized on
                desktop and collapses to an accordion on mobile devices.
              </p>

              <h3 class="text-base font-medium text-gray-200 mb-2">Features</h3>
              <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Resizable sidebar with drag handle</li>
                <li>Mobile-responsive accordion navigation</li>
                <li>Clean, documentation-focused design</li>
                <li>Smooth transitions and hover effects</li>
              </ul>

              <div class="bg-blue-900/30 border border-blue-700/50 rounded p-4 mb-4">
                <p class="text-blue-200 text-sm">
                  <strong>Try it:</strong> Drag the right edge of the sidebar to
                  resize it, or use the toggle button to hide/show the
                  navigation.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}




