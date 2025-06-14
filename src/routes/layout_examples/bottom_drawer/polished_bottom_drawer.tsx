import { createEffect, createSignal, JSXElement, onMount } from "solid-js";
import "./app.css";

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
const MOBILE_DRAWER_WIDTH = "w-64";

function MyLayout() {
  const [drawerWidth, setDrawerWidth] = createSignal(256); // Default 256px (w-64)
  const [isTopVisible, setIsTopVisible] = createSignal(true);
  const [isBottomVisible, setIsBottomVisible] = createSignal(true);
  const [isDrawerVisible, setIsDrawerVisible] = createSignal(false);
  const [isDrawerMaximized, setIsDrawerMaximized] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);

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
        } else if (e.key === "2" || (e.ctrlKey && e.key === "1")) {
          setIsBottomVisible(!isBottomVisible());
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    });
  });

  const DRAWER_BLUR = false;

  // .............................................................................
  return (
    <div>
      {/* Overlay */}
      <div
        classList={{
          "fixed inset-0": true,
          "bg-black/50 ": true,
          "backdrop-blur-sm": DRAWER_BLUR,
          [Z_INDICES.overlay]: true,
          "opacity-0 pointer-events-none": !isDrawerVisible(),
          "opacity-100": isDrawerVisible(),
          "pointer-events-auto": isDrawerVisible(),
          "transition-opacity duration-300 ease-in-out": true,
          "md:hidden": true,
        }}
        onclick={() => setIsDrawerVisible(false)}
      />

      {/* Sidebar */}
      <div
        classList={{
          "bg-green-500 border border-green-600": true,
          fixed: true,
          "inset-x-0": true,
          "bottom-0": true,
          "mb-bottom_header": isBottomVisible(),
          "translate-y-full": !isDrawerVisible(),
          [Z_INDICES.mobileDrawer]: true,

          // If full lower drawer
          "h-1/2 md:h-auto": !isDrawerMaximized(),
          "h-between_headers": isDrawerMaximized(),

          // Now Handle Desktop
          "md:w-sidebar_width": true,
          "md:top-0": true,
          "md:left-0": true,
          "md:inset-y-0": true,
          "md:-translate-x-full md:translate-y-0": !isDrawerVisible(),

          // Animate movements
          "transition-translate duration-300 ease-in-out": !isResizing(),
          "transition-none": isResizing(),
        }}
      >
        <div class="flex flex-col h-full">
          <div class="flex justify-center">
            {/* Drag Handle */}
            <div class="md:hidden">
              <button
                class="bg-transparent hover:bg-gray-200/20 rounded-full w-16 h-8 flex items-center justify-center transition-colors"
                onclick={() => {
                  setIsDrawerMaximized(!isDrawerMaximized());
                }}
              >
                <div class="bg-gray-300 hover:bg-gray-400 rounded-full w-12 h-1 transition-colors"></div>
              </button>
            </div>
          </div>
          <div class="flex-1 p-4 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          classList={{
            // Visibility & Responsive
            "hidden md:block": true,
            // Positioning
            "absolute right-0 top-0": true,
            // Sizing
            "w-10 h-full": true,
            // Styling & Interaction
            "bg-gray-400 hover:bg-gray-600 cursor-col-resize transition-colors":
              true,
          }}
        />
      </div>

      {/* Main Content */}
      <div
        classList={{
          // Basic Layout
          "flex justify-center items-center p-4": true,
          // Desktop Layout
          "mb-bottom_header": isBottomVisible(),
          "md:ml-sidebar_width": isDrawerVisible(),
          "transition-all duration-300 ease-in-out": !isResizing(),
          "transition-none": isResizing(),
        }}
      >
        <Article />
      </div>

      {/* Bottom */}
      <div
        classList={{
          "bg-blue-500/50 border border-blue-600": true,
          fixed: true,
          "inset-x-0 h-bottom_header bottom-0": true,

          [Z_INDICES.bottomHeader]: true,

          // Allow Hiding Bottm
          "translate-y-full": !isBottomVisible(),
          "transition-all duration-300 ease-in-out": true,
        }}
      >
        <div class="h-full flex justify-center md:justify-start">
          {/* KDE Plasma-style start menu button */}
          <button
            class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 h-full transition-colors"
            onclick={() => {
              setIsDrawerVisible(!isDrawerVisible());
            }}
            oncontextmenu={(e) => {
              // maximize height before opening
              e.preventDefault();
              setIsDrawerMaximized(!isDrawerMaximized());
              setIsDrawerVisible(!isDrawerVisible());
              // Right click handler - add your logic here
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
        {(() => {
          const items = [];
          for (let i = 1; i <= 300; i++) {
            items.push(<li key={i}>List item {i}</li>);
          }
          return items;
        })()}
      </ul>
      :way[]
    </div>
  );
};

const Article = (props: {}) => {
  return (
    <div class="prose dark:prose-invert">
      <h1>Main Content Area</h1>
      <p class="">
        This content area adjusts based on the sidebar and header visibility.
      </p>
      <div class="">
        <p class="">Current layout state:</p>
        <ul class=""></ul>
      </div>
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
