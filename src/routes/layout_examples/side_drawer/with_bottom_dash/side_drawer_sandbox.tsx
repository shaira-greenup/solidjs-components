import { createEffect, createSignal, For, JSXElement, onMount } from "solid-js";
import { tv } from "tailwind-variants";
import "./app.css";
const DEV = false;

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <MyLayout />
    </main>
  );
}

function LayoutContainer(props: { children: JSXElement }) {
  return (
    <div class="h-full flex flex-col border-4 border-purple-500 m-4">
      {props.children}
    </div>
  );
}

function MainArea(props: { children: JSXElement }) {
  return (
    <div class="flex-1 relative md:flex overflow-hidden">{props.children}</div>
  );
}

interface ToggleButtonProps {
  label: string;
  inputId: string;
}

const ToggleButton = (props: ToggleButtonProps) => {
  return (
    <label
      for={props.inputId}
      classList={{
        // Display & Interaction
        "block cursor-pointer": true,
        // Background & Colors
        "bg-blue-500 text-white": true,
        // Spacing & Layout
        "px-4 py-2": true,
        // Visual styling
        rounded: true,
      }}
    >
      {props.label}
    </label>
  );
};

// TODO should this be CSS or js something?
const Z_INDICES = {
  mobileDrawer: "z-50",
  topHeader: "z-10",
  bottomHeader: "z-50",
  overlay: "z-40",
  sidebar: "z-10",
};

// It may be decessary to ensure all animations align
const ANIMATION = "transition-all duration-300 ease-in-out";
const navbar = tv({
  base: [
    // colors
    "bg-base-300 shadow-sm",
    // Positioning
    "fixed",
    // Size
    "inset-x-0 h-top_header top-0",
    // Z
    Z_INDICES.bottomHeader,
    // Animations
    ANIMATION,
  ],
  variants: {
    visible: {
      true: "translate-y-0",
      false: "-translate-y-full",
    },
    dev: {
      true: "bg-blue-500/50 border border-blue-600",
    },
  },
});

const button = tv({
  base: "flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 h-full transition-colors",
});

const overlay = tv({
  base: [
    // Positioning
    "fixed inset-0",
    // Background & Effects
    "bg-black/10",
    // Z-index
    Z_INDICES.overlay,
    // Animation (Must smoothly adjust for hiding nav when drawer open, so keep consistent)
    ANIMATION,
    // Responsive
    "md:hidden",
  ],
  variants: {
    visible: {
      true: "opacity-100 pointer-events-auto",
      false: "opacity-0 pointer-events-none",
    },
    blur: {
      true: "backdrop-blur-sm",
    },
    bottomDashVisible: {
      true: "mb-bottom_dash",
    },
  },
});

const sidebar = tv({
  base: [
    // Colors
    "bg-base-200 border-r border-gray-200 shadow-sm",
    // Positioning
    "fixed",
    // Size
    "w-3/4 md:w-auto",
    // Sets top: 0 and bottom: 0 to stretch the sidebar full height
    "inset-y-0",
    // Extend to the bottom
    "bottom-0",
    // Z-index
    Z_INDICES.mobileDrawer,

    // Handle desktop
    "md:w-sidebar_width",
    "md:top-0",
    "md:left-0",
    "md:inset-y-0",
    "md:z-10",
  ],
  variants: {
    // Block animations when resizing
    resizing: {
      true: "transition-none",
      false: "transition-translate duration-300 ease-in-out",
    },
    isVisible: {
      true: "translate-x-0",
      false: [
        // Desktop
        "md:-translate-x-full md:translate-y-0",
        // Mobile
        "-translate-x-full",
      ],
    },
    bottomDashVisible: {
      true: "mb-bottom_dash",
      false: "mb-0",
    },
    topNavVisible: {
      true: "mt-top_header",
      false: "mt-0",
    },
    dev: {
      true: "bg-green-500 border border-green-600",
    },
  },
});

const resizeHandle = tv({
  base: [
    // Visibility & Responsive
    // Show on medium screens and up, hidden on mobile
    // This creates a desktop-only resize handle since mobile uses touch gestures
    "hidden md:block bg-transparent",
    // Positioning
    "absolute right-0 top-0",
    // Sizing
    "w-15 h-full",
    // Styling & Interaction
    "hover:bg-primary/50 cursor-col-resize transition-colors duration-200",
    // Professional styling
    "border-r border-gray-400",
  ],
  variants: {
    dev: {
      true: [
        // Dev variant with translucent colors similar to MainContent and bottomDash
        // "bg-blue-500/40 hover:bg-blue-600/60",
        // "border-r border-blue-400",
        // "w-2",
        // Styling & Interaction
        "bg-gray-400 hover:bg-gray-600 cursor-col-resize transition-colors",
        // Wider
        "w-10",
      ],
    },
  },
});
const MainContent = tv({
  base: [
    // Color is helpful
    "bg-base-100",
    // Basic Layout
    "flex justify-center items-center p-4",
  ],
  variants: {
    drawerVisible: {
      true: "md:ml-sidebar_width",
    },
    isResizing: {
      false: ANIMATION,
      true: "tranistion-none",
    },
    isTopVisible: {
      true: "mt-top_header",
    },
    isBottomVisible: {
      true: "mb-bottom_dash",
    },
    dev: {
      true: [
        // Translucent Colors
        "bg-orange-600/50",
      ],
    },
  },
});

const bottomDash = tv({
  base: [
    // colors
    "bg-base-300",
    // Position
    "fixed bottom-0 left-0",
    // Size
    "h-bottom_dash  w-full",
    // Animation
    ANIMATION,
    // Z Index
    Z_INDICES.mobileDrawer,
  ],
  variants: {
    hidden: {
      true: "translate-y-full",
    },
    dev: {
      true: [
        // Translucent colors
        "bg-purple-600/40",
      ],
    },
  },
});

function MyLayout() {
  const [drawerWidth, setDrawerWidth] = createSignal(256); // Default 256px (w-64)
  const [isTopVisible, setIsTopVisible] = createSignal(true);
  const [isDrawerVisible, setIsDrawerVisible] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);
  // Optionally toggle the dash on mobile
  const [isBottomVisible, setIsBottomVisible] = createSignal(true);

  let resizeRef!: HTMLDivElement;
  let startX = 0;
  let startWidth = 0;
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 1024;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX = e.clientX;
    startWidth = drawerWidth();

    if (document) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing()) return;

    const deltaX = e.clientX - startX;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, startWidth + deltaX),
    );
    setDrawerWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    if (document) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX = e.touches[0].clientX;
    startWidth = drawerWidth();

    if (document) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      document.body.style.userSelect = "none";
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing()) return;

    const deltaX = e.touches[0].clientX - startX;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, startWidth + deltaX),
    );
    setDrawerWidth(newWidth);
  };

  const handleTouchEnd = () => {
    setIsResizing(false);
    if (document) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  /* If Required, the following changes the size of, e.g., bottom Drawer */
  onMount(() => {
    createEffect(() => {
      document.documentElement.style.setProperty(
        "--spacing-sidebar_width",
        `${drawerWidth()}px`,
      );
    });
  });

  onMount(() => {
    // Add keyboard event listener
    createEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "1" || (e.ctrlKey && e.key === "1")) {
          setIsDrawerVisible(!isDrawerVisible());
        } else if (e.key === "2" || (e.ctrlKey && e.key === "2")) {
          setIsTopVisible(!isTopVisible());
        } else if (e.key === "3" || (e.ctrlKey && e.key === "3")) {
          setIsBottomVisible(!isBottomVisible());
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    });
  });

  // .............................................................................
  return (
    <div>
      {/* Top Navbar */}
      <div class={navbar({ visible: isTopVisible(), dev: DEV })}>
        <div class="h-full flex justify-center md:justify-start">
          {/* KDE Plasma-style start menu button */}
          <button
            class={button()}
            onclick={() => {
              setIsDrawerVisible(!isDrawerVisible());
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
        class={overlay({
          visible: isDrawerVisible(),
          blur: true,
          bottomDashVisible: isBottomVisible(),
        })}
        onclick={() => setIsDrawerVisible(false)}
      />

      {/* Sidebar */}
      <div
        class={sidebar({
          resizing: isResizing(),
          isVisible: isDrawerVisible(),
          bottomDashVisible: isBottomVisible(),
          topNavVisible: isTopVisible(),
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
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          class={resizeHandle({ dev: DEV })}
        />
      </div>

      {/* Main Content */}
      <div
        class={MainContent({
          drawerVisible: isDrawerVisible(),
          isResizing: isResizing(),
          isTopVisible: isTopVisible(),
          isBottomVisible: isBottomVisible(),
          dev: DEV,
        })}
      >
        <Article />
      </div>

      {/*Bottom Mobile Dash*/}
      <div class={bottomDash({ hidden: !isBottomVisible(), dev: DEV })} />
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

const Slider = (props: {
  value: number;
  onInput: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  class?: string;
}) => {
  return (
    <input
      type="range"
      value={props.value}
      min={props.min ?? 0}
      max={props.max ?? 100}
      step={props.step ?? 1}
      class={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${props.class || ""}`}
      onInput={(e) => props.onInput(Number(e.currentTarget.value))}
    />
  );
};

const DrawerControlPanel = (props: {
  drawerWidth: () => number;
  setDrawerWidth: (value: number) => void;
  isTopVisible: () => boolean;
}) => {
  return (
    <>
      <Slider
        value={props.drawerWidth()}
        onInput={props.setDrawerWidth}
        min={200}
        max={400}
        step={16}
        class="mb-4"
      />
      <div
        classList={{
          "bg-red-500/50 border border-red-600": true,
          "fixed w-full bottom-0": true,
          "h-bottom_header": true,
          "-translate-y-full": !props.isTopVisible(),
        }}
      />
    </>
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
