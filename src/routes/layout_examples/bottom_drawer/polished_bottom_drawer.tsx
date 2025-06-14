import { createEffect, createSignal, JSXElement, onMount } from "solid-js";
import "./app_polished.css";

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <MyLayout />
    </main>
  );
}

function LayoutContainer(props: { children: JSXElement }) {
  return (
    <div class="h-full flex flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]">
      {props.children}
    </div>
  );
}

function MainArea(props: { children: JSXElement }) {
  return (
    <div class="flex-1 relative md:flex overflow-hidden bg-[var(--color-base-100)]">{props.children}</div>
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
        "bg-[var(--color-primary)] text-[var(--color-primary-content)]": true,
        "hover:bg-[var(--color-primary)]/90": true,
        // Spacing & Layout
        "px-4 py-2": true,
        // Visual styling
        "rounded-lg": true,
        "transition-colors duration-200": true,
        "font-medium": true,
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
          "bg-[var(--color-neutral)]/60": true,
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
          "bg-[var(--color-base-200)] border-r border-[var(--color-base-300)]": true,
          "shadow-xl": true,
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
          "transition-all duration-300 ease-in-out": !isResizing(),
          "transition-none": isResizing(),
        }}
      >
        <div class="flex flex-col h-full">
          <div class="flex justify-center">
            {/* Drag Handle */}
            <div class="md:hidden py-2">
              <button
                class="bg-transparent hover:bg-[var(--color-base-300)]/50 rounded-full w-16 h-8 flex items-center justify-center transition-colors"
                onclick={() => {
                  setIsDrawerMaximized(!isDrawerMaximized());
                }}
              >
                <div class="bg-[var(--color-base-content)]/30 hover:bg-[var(--color-base-content)]/50 rounded-full w-12 h-1 transition-colors"></div>
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
            "w-1 h-full": true,
            // Styling & Interaction
            "bg-[var(--color-base-300)] hover:bg-[var(--color-primary)] cursor-col-resize transition-colors duration-200":
              true,
            "hover:w-2": true,
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

      {/* Bottom Taskbar */}
      <div
        classList={{
          "bg-[var(--color-base-200)]/95 backdrop-blur-md border-t border-[var(--color-base-300)]": true,
          "shadow-lg": true,
          fixed: true,
          "inset-x-0 h-bottom_header bottom-0": true,

          [Z_INDICES.bottomHeader]: true,

          // Allow Hiding Bottom
          "translate-y-full": !isBottomVisible(),
          "transition-all duration-300 ease-in-out": true,
        }}
      >
        <div class="h-full flex items-center justify-between px-4">
          {/* Left side - Start menu button */}
          <div class="flex items-center space-x-2">
            <button
              class="flex items-center space-x-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary-content)] px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              onclick={() => {
                setIsDrawerVisible(!isDrawerVisible());
              }}
              oncontextmenu={(e) => {
                e.preventDefault();
                setIsDrawerMaximized(!isDrawerMaximized());
                setIsDrawerVisible(!isDrawerVisible());
              }}
            >
              <ApplicationGridIcon />
              <span class="text-sm select-none">Applications</span>
            </button>
          </div>

          {/* Center - System info or quick actions */}
          <div class="flex items-center space-x-4">
            <div class="text-[var(--color-base-content)]/70 text-sm font-medium">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Right side - System controls */}
          <div class="flex items-center space-x-2">
            <button
              class="p-2 hover:bg-[var(--color-base-300)]/50 rounded-lg transition-colors duration-200"
              onclick={() => setIsBottomVisible(false)}
              title="Hide taskbar"
            >
              <svg class="w-4 h-4 text-[var(--color-base-content)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ApplicationGridIcon = () => {
  return (
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
    </svg>
  );
};

const SidebarContent = () => {
  const categories = [
    { name: "Productivity", items: ["Documents", "Spreadsheets", "Presentations", "Notes"] },
    { name: "Development", items: ["Code Editor", "Terminal", "Git Client", "Database"] },
    { name: "Design", items: ["Image Editor", "Vector Graphics", "3D Modeling", "Prototyping"] },
    { name: "Communication", items: ["Email", "Chat", "Video Calls", "Social"] },
    { name: "Media", items: ["Music Player", "Video Player", "Photo Viewer", "Streaming"] },
    { name: "Utilities", items: ["File Manager", "Calculator", "Calendar", "Weather"] },
  ];

  return (
    <div class="space-y-6">
      <div class="px-2">
        <h2 class="text-lg font-semibold text-[var(--color-base-content)] mb-4">Applications</h2>
        <div class="relative mb-4">
          <input
            type="text"
            placeholder="Search applications..."
            class="w-full px-4 py-2 bg-[var(--color-base-100)] border border-[var(--color-base-300)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-[var(--color-base-content)] placeholder-[var(--color-base-content)]/50"
          />
          <svg class="absolute right-3 top-2.5 w-5 h-5 text-[var(--color-base-content)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="space-y-4">
        {categories.map((category) => (
          <div class="px-2">
            <h3 class="text-sm font-medium text-[var(--color-base-content)]/70 uppercase tracking-wide mb-2">
              {category.name}
            </h3>
            <div class="space-y-1">
              {category.items.map((item) => (
                <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--color-base-300)]/50 text-[var(--color-base-content)] transition-colors duration-200 flex items-center space-x-3">
                  <div class="w-8 h-8 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                    <div class="w-4 h-4 bg-[var(--color-primary)] rounded-sm"></div>
                  </div>
                  <span class="text-sm font-medium">{item}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Article = (props: {}) => {
  return (
    <div class="max-w-4xl mx-auto p-8">
      <div class="bg-[var(--color-base-200)] rounded-xl shadow-sm border border-[var(--color-base-300)] p-8">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <h1 class="text-3xl font-bold text-[var(--color-base-content)] mb-6">
            Professional Application Layout
          </h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-[var(--color-base-100)] p-6 rounded-lg border border-[var(--color-base-300)]">
              <h3 class="text-lg font-semibold text-[var(--color-base-content)] mb-3">Features</h3>
              <ul class="space-y-2 text-[var(--color-base-content)]/80">
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                  <span>Responsive design</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                  <span>Dark/light theme support</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                  <span>Resizable sidebar</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
                  <span>Keyboard shortcuts</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-[var(--color-base-100)] p-6 rounded-lg border border-[var(--color-base-300)]">
              <h3 class="text-lg font-semibold text-[var(--color-base-content)] mb-3">Controls</h3>
              <div class="space-y-3 text-sm text-[var(--color-base-content)]/80">
                <div class="flex justify-between">
                  <span>Toggle Sidebar:</span>
                  <kbd class="px-2 py-1 bg-[var(--color-base-300)] rounded text-xs">1</kbd>
                </div>
                <div class="flex justify-between">
                  <span>Toggle Taskbar:</span>
                  <kbd class="px-2 py-1 bg-[var(--color-base-300)] rounded text-xs">2</kbd>
                </div>
                <div class="flex justify-between">
                  <span>Right-click Apps:</span>
                  <span class="text-xs">Maximize drawer</span>
                </div>
              </div>
            </div>
          </div>

          <p class="text-[var(--color-base-content)]/80 leading-relaxed mb-6">
            This professional application layout demonstrates modern UI patterns with a clean, 
            accessible design. The interface adapts seamlessly between mobile and desktop viewports, 
            providing an optimal user experience across all devices.
          </p>

          <div class="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-6 rounded-lg border border-[var(--color-primary)]/20">
            <h3 class="text-lg font-semibold text-[var(--color-base-content)] mb-2">
              Modern Design System
            </h3>
            <p class="text-[var(--color-base-content)]/80">
              Built with CSS custom properties for consistent theming, smooth animations, 
              and professional visual hierarchy. The layout uses modern CSS techniques 
              including CSS Grid, Flexbox, and custom properties for maintainable styling.
            </p>
          </div>
        </div>
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
      class={`w-full h-2 bg-[var(--color-base-300)] rounded-lg appearance-none cursor-pointer slider ${props.class || ""}`}
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
