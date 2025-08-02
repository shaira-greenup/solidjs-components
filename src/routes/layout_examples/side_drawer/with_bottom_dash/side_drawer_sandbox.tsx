import { createEffect, createSignal, For, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import "./app.css";
import {
  bottomDashSty,
  buttonSty,
  MainContentSty,
  navbarSty,
  overlaySty,
  resizeHandleSty,
  sidebarSty,
} from "./styles";
import { createGlobalKeybindings } from "./side_drawer_sandbox_keybindings";
import { resizeHandle } from "./side_drawer_resize_directive";

const DEV = false;
const BOTTOM_DASH_ONLY_ON_MOBILE = false;

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <MyLayout />
    </main>
  );
}

function MyLayout() {
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 1024;

  const [layoutState, setLayoutState] = createStore({
    drawer: {
      width: 256, // Default 256px (w-64)
      visible: false,
      isResizing: false,
      startX: 0,
      startWidth: 0
    },
    topBar: {
      visible: true
    },
    bottomDash: {
      visible: true
    }
  });


  // Set up global keybindings (work anywhere on the page, not just when component is focused)
  createGlobalKeybindings(layoutState, setLayoutState);

  /* If Required, the following changes the size of, e.g., bottom Drawer */
  onMount(() => {
    createEffect(() => {
      document.documentElement.style.setProperty(
        "--spacing-sidebar_width",
        `${layoutState.drawer.width}px`,
      );
    });
  });

  // .............................................................................
  return (
    <div>
      {/* Top Navbar */}
      <div class={navbarSty({ visible: layoutState.topBar.visible, dev: DEV })}>
        <div class="h-full flex justify-center md:justify-start">
          {/* KDE Plasma-style start menu button */}
          <button
            class={buttonSty()}
            onclick={() => {
              setLayoutState('drawer', 'visible', !layoutState.drawer.visible);
            }}
          >
            {/* Application grid icon */}
            <ApplicationGridIcon />
            <span class="text-white text-sm font-medium select-none">
              Applications
            </span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        class={overlaySty({
          visible: layoutState.drawer.visible,
          blur: true,
          bottomDashVisible: layoutState.bottomDash.visible,
        })}
        onclick={() => setLayoutState('drawer', 'visible', false)}
      />

      {/* Sidebar */}
      <div
        class={sidebarSty({
          resizing: layoutState.drawer.isResizing,
          isVisible: layoutState.drawer.visible,
          bottomDashVisible: layoutState.bottomDash.visible,
          bottomDashMobileOnly: BOTTOM_DASH_ONLY_ON_MOBILE,
          topNavVisible: layoutState.topBar.visible,
          dev: DEV,
        })}
      >
        <div class="flex flex-col h-full">
          <div class="flex-1 p-4 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
        {/* Resize Handle */}
        <div
          use:resizeHandle={{
            layoutState,
            setLayoutState,
            minWidth: MIN_WIDTH,
            maxWidth: MAX_WIDTH
          }}
          class={resizeHandleSty({ dev: DEV })}
        />
      </div>

      {/* Main Content */}
      <div
        class={MainContentSty({
          drawerVisible: layoutState.drawer.visible,
          isResizing: layoutState.drawer.isResizing,
          isTopVisible: layoutState.topBar.visible,
          isBottomVisible: layoutState.bottomDash.visible,
          bottomDashMobileOnly: BOTTOM_DASH_ONLY_ON_MOBILE,
          dev: DEV,
        })}
      >
        <Article />
      </div>

      {/*Bottom Mobile Dash*/}
      <div class={bottomDashSty({ 
        hidden: !layoutState.bottomDash.visible, 
        mobileOnly: BOTTOM_DASH_ONLY_ON_MOBILE,
        dev: DEV 
      })} />
    </div>
  );
}

const ApplicationGridIcon = () => {
  return (
    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
    </svg>
  );
};

const SidebarContent = () => {
  return (
    <div class="prose dark:prose-invert">
      <ul>
        <For each={Array.from({ length: 300 }, (_, i) => i + 1)}>
          {(i) => <li>List item {i}</li>}
        </For>
      </ul>
      :way[]
    </div>
  );
};

const Article = () => {
  // Create an array for the range 1 to 10.
  const range = Array.from({ length: 10 }, (_, i) => i + 1);

  const Kbd = (props: { children: any }) => {
    return (
      <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
        {props.children}
      </kbd>
    );
  };

  return (
    <div class="prose dark:prose-invert">
      <h2>Keyboard Shortcuts</h2>
      <div class="mb-6">
        <p>Use the following keyboard shortcuts to control the layout:</p>
        <ul>
          <li>
            <Kbd>1</Kbd> or <Kbd>Ctrl+1</Kbd> - Toggle sidebar/drawer visibility
          </li>
          <li>
            <Kbd>2</Kbd> or <Kbd>Ctrl+2</Kbd> - Toggle top navigation bar
          </li>
          <li>
            <Kbd>3</Kbd> or <Kbd>Ctrl+3</Kbd> - Toggle bottom dashboard
          </li>
        </ul>
      </div>

      <For each={range}>
        {(item) => (
          <div>
            <h1>Main Content Area {item}</h1>
            <p>
              This content area adjusts based on the sidebar and header
              visibility.
            </p>
            <div>
              <p>Current layout state:</p>
              <ul>{/* List items can be generated here if required */}</ul>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

/*
 * # NOTES
 * ## Desired Layout
 * - Mobile
 *   - Sidebar / Drawer Depending on Width
 *   - Optional Bottom Drawer that can toggle to side
 *     - User may have need depending on device size and current circumstance (e.g. coffee vs presentation vs desktop with small window)
 *   - Bottom Dash for Quick Access
 *     - Can be hidden for convenience and circumstance (narrow AND short display)
 *     - This can also use translate-y to drop away, i.e. no worry about DOM bloat here, small size
 * - Desktop
 *   - Top Header Bar
 *     - Probably this should persist, it should have all user controls
 *   - Sidebar
 *     - Collapsible
 *         - Pushes content aside
 * ## Limitations
 * ## Depencency Map
 * 1. Mobile Drawer bottom- depends on visibility of bottom drawer
 * ## Tasks
 * * Mobile bottom drawer should be able to toggle
 */
