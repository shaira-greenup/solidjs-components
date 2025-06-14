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
        "px-4 py-2.5": true,
        // Visual styling
        "rounded-lg font-medium transition-all duration-200": true,
        "shadow-sm hover:shadow-md": true,
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
  const [isTopVisible_old, setIsTopVisible_old] = createSignal(true);
  const [isTopVisible, setIsTopVisible] = createSignal(true);
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
          setIsTopVisible(!isTopVisible());
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
          "bg-[var(--color-base-200)] border-r border-[var(--color-base-300)]": true,
          "shadow-xl": true,
          fixed: true,
          "w-80 md:w-auto": true,
          "inset-y-0": true,
          "bottom-0": true,
          "mt-top_header": isTopVisible(),
          "-translate-x-full": !isDrawerVisible(),
          [Z_INDICES.mobileDrawer]: true,

          // Now Handle Desktop
          "md:w-sidebar_width": true,
          "md:top-0": true,
          "md:left-0": true,
          "md:inset-y-0": true,
          "md:-translate-x-full md:translate-y-0": !isDrawerVisible(),

          // Animate movements
          "transition-all duration-300 ease-out": !isResizing(),
          "transition-none": isResizing(),
        }}
      >
        <div class="flex flex-col h-full">
          {/* Sidebar Header */}
          <div class="p-6 border-b border-[var(--color-base-300)]">
            <h2 class="text-lg font-semibold text-[var(--color-base-content)] mb-1">
              Navigation
            </h2>
            <p class="text-sm text-[var(--color-base-content)]/70">
              Browse application sections
            </p>
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
            "bg-[var(--color-base-300)] hover:bg-[var(--color-primary)] cursor-col-resize transition-all duration-200":
              true,
            "hover:w-1.5": true,
          }}
        />
      </div>

      {/* Main Content */}
      <div
        classList={{
          // Basic Layout
          "flex-1 min-h-0": true,
          // Desktop Layout
          "md:ml-sidebar_width": isDrawerVisible(),
          "transition-all duration-300 ease-out": !isResizing(),
          "transition-none": isResizing(),
          "mt-top_header": isTopVisible(),
        }}
      >
        <div class="h-full overflow-auto">
          <div class="max-w-4xl mx-auto p-8">
            <Article />
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div
        classList={{
          "bg-[var(--color-base-200)] border-b border-[var(--color-base-300)]": true,
          "backdrop-blur-md bg-[var(--color-base-200)]/95": true,
          fixed: true,
          "inset-x-0 h-top_header top-0": true,
          "shadow-sm": true,

          [Z_INDICES.bottomHeader]: true,

          // Allow Hiding Header
          "-translate-y-full": !isTopVisible(),
          "transition-all duration-300 ease-out": true,
        }}
      >
        <div class="h-full flex items-center justify-between px-6">
          {/* Left side - Menu button */}
          <div class="flex items-center space-x-4">
            <button
              class="flex items-center space-x-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary-content)] px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
              <span class="text-sm font-medium select-none hidden sm:inline">
                Menu
              </span>
            </button>
            
            {/* App Title */}
            <div class="hidden md:block">
              <h1 class="text-lg font-semibold text-[var(--color-base-content)]">
                Professional App
              </h1>
            </div>
          </div>

          {/* Right side - User actions */}
          <div class="flex items-center space-x-3">
            <button class="p-2 rounded-lg hover:bg-[var(--color-base-300)] transition-colors duration-200">
              <SearchIcon />
            </button>
            <button class="p-2 rounded-lg hover:bg-[var(--color-base-300)] transition-colors duration-200">
              <NotificationIcon />
            </button>
            <button class="p-2 rounded-lg hover:bg-[var(--color-base-300)] transition-colors duration-200">
              <UserIcon />
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

const SearchIcon = () => {
  return (
    <svg class="w-5 h-5 text-[var(--color-base-content)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
};

const NotificationIcon = () => {
  return (
    <svg class="w-5 h-5 text-[var(--color-base-content)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25a2.25 2.25 0 0 1-2.25 2.25H2a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.25a2.25 2.25 0 0 1-2.25-2.25V9.75a6 6 0 0 0-6-6z" />
    </svg>
  );
};

const UserIcon = () => {
  return (
    <svg class="w-5 h-5 text-[var(--color-base-content)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
};

const SidebarContent = () => {
  const navigationItems = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: "📈", label: "Analytics", active: false },
    { icon: "👥", label: "Users", active: false },
    { icon: "⚙️", label: "Settings", active: false },
    { icon: "📁", label: "Projects", active: false },
    { icon: "💬", label: "Messages", active: false },
    { icon: "📋", label: "Tasks", active: false },
    { icon: "🔔", label: "Notifications", active: false },
  ];

  return (
    <div class="space-y-2">
      {navigationItems.map((item, index) => (
        <button
          key={index}
          classList={{
            "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200": true,
            "bg-[var(--color-primary)] text-[var(--color-primary-content)] shadow-sm": item.active,
            "text-[var(--color-base-content)] hover:bg-[var(--color-base-300)]": !item.active,
            "font-medium": item.active,
          }}
        >
          <span class="text-lg">{item.icon}</span>
          <span class="text-sm">{item.label}</span>
        </button>
      ))}
      
      <div class="pt-4 mt-6 border-t border-[var(--color-base-300)]">
        <h3 class="text-xs font-semibold text-[var(--color-base-content)]/60 uppercase tracking-wider mb-3 px-3">
          Recent
        </h3>
        <div class="space-y-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm text-[var(--color-base-content)]/80 hover:bg-[var(--color-base-300)] transition-colors duration-200"
            >
              <div class="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
              <span>Recent item {i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Article = (props: {}) => {
  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 text-[var(--color-primary-content)]">
        <h1 class="text-4xl font-bold mb-4">
          Welcome to Professional App
        </h1>
        <p class="text-lg opacity-90 mb-6">
          Experience a modern, responsive interface designed for productivity and elegance.
        </p>
        <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105">
          Get Started
        </button>
      </div>

      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Users", value: "12,345", change: "+12%", icon: "👥" },
          { title: "Revenue", value: "$45,678", change: "+8%", icon: "💰" },
          { title: "Projects", value: "89", change: "+23%", icon: "📊" },
        ].map((stat, index) => (
          <div
            key={index}
            class="bg-[var(--color-base-200)] rounded-xl p-6 border border-[var(--color-base-300)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl">{stat.icon}</span>
              <span class="text-sm text-[var(--color-success)] font-medium bg-[var(--color-success)]/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-[var(--color-base-content)] mb-1">
              {stat.value}
            </h3>
            <p class="text-sm text-[var(--color-base-content)]/70">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div class="bg-[var(--color-base-200)] rounded-xl p-8 border border-[var(--color-base-300)]">
        <h2 class="text-2xl font-bold text-[var(--color-base-content)] mb-4">
          Dynamic Layout System
        </h2>
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-[var(--color-base-content)]/80 leading-relaxed">
            This application features a responsive layout that adapts seamlessly to different screen sizes. 
            The sidebar can be toggled on mobile devices and resized on desktop for optimal workflow customization.
          </p>
          <div class="mt-6 p-4 bg-[var(--color-base-300)]/50 rounded-lg">
            <h4 class="font-semibold text-[var(--color-base-content)] mb-2">
              Keyboard Shortcuts:
            </h4>
            <ul class="space-y-1 text-sm text-[var(--color-base-content)]/70">
              <li><kbd class="px-2 py-1 bg-[var(--color-base-300)] rounded text-xs">1</kbd> Toggle sidebar</li>
              <li><kbd class="px-2 py-1 bg-[var(--color-base-300)] rounded text-xs">2</kbd> Toggle header</li>
            </ul>
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
      class={`w-full h-2 bg-[var(--color-base-300)] rounded-lg appearance-none cursor-pointer slider hover:bg-[var(--color-base-300)]/80 transition-colors duration-200 ${props.class || ""}`}
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
