import { createEffect, createSignal, JSX, onMount } from "solid-js";

interface LayoutProps {
  children: JSX.Element;
  sidebar: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  const [drawerWidth, setDrawerWidth] = createSignal(256); // Default 256px (w-64)
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
        if (e.ctrlKey && e.altKey && e.key === "b") {
          setIsBottomVisible(!isBottomVisible());
        } else if (e.ctrlKey && e.key === "b") {
          setIsDrawerVisible(!isDrawerVisible());
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    });
  });

  const DRAWER_BLUR = false;
  const Z_INDICES = {
    mobileDrawer: "z-50",
    topHeader: "z-10",
    bottomHeader: "z-50",
    overlay: "z-40",
    sidebar: "z-10",
  };

  return (
    <div class="min-h-screen bg-[var(--color-base-100)] text-[var(--color-base-content)]">
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

          // Mobile positioning - bottom drawer
          "inset-x-0 bottom-0": true,
          "mb-bottom_header": isBottomVisible(),
          "translate-y-full": !isDrawerVisible(),
          [Z_INDICES.mobileDrawer]: true,

          // Mobile heights
          "h-1/2": !isDrawerMaximized(),
          "h-between_headers": isDrawerMaximized(),
          "max-h-screen": true, // Prevent overflow on small screens

          // Desktop positioning - side drawer
          "md:w-sidebar_width md:top-0 md:left-0 md:inset-y-0 md:h-auto": true,
          "md:-translate-x-full md:translate-y-0": !isDrawerVisible(),
          "md:inset-x-auto": true, // Reset mobile inset-x-0 on desktop

          // Smooth transitions
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
          <div class="flex-1 p-4 overflow-y-auto">{props.sidebar}</div>
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
            "bg-[var(--color-base-300)] hover:bg-[var(--color-primary)] cursor-col-resize transition-colors duration-200": true,
            "hover:w-2": true,
          }}
        />
      </div>

      {/* Main Content */}
      <div
        classList={{
          // Basic Layout - Mobile first
          "flex justify-center items-start min-h-screen": true,
          "p-2 pt-4 pb-20": true, // Extra bottom padding for mobile taskbar
          "sm:p-4 sm:pb-20": true,
          // Desktop Layout
          "md:pb-bottom_header": isBottomVisible(),
          "md:ml-sidebar_width": isDrawerVisible(),
          "transition-all duration-300 ease-in-out": !isResizing(),
          "transition-none": isResizing(),
        }}
      >
        {props.children}
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
        <div class="h-full flex items-center justify-between px-2 sm:px-4">
          {/* Left side - Start menu button */}
          <div class="flex items-center space-x-2">
            <button
              class="flex items-center space-x-2 sm:space-x-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary-content)] px-2 py-2 sm:px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
              <span class="text-xs sm:text-sm select-none hidden xs:inline">
                Applications
              </span>
            </button>
          </div>

          {/* Center - System info or quick actions */}
          <div class="flex items-center space-x-2 sm:space-x-4">
            <div class="text-[var(--color-base-content)]/70 text-xs sm:text-sm font-medium">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Right side - System controls */}
          <div class="flex items-center space-x-1 sm:space-x-2">
            <button
              class="p-1.5 sm:p-2 hover:bg-[var(--color-base-300)]/50 rounded-lg transition-colors duration-200"
              onclick={() => setIsBottomVisible(false)}
              title="Hide taskbar"
            >
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-base-content)]/70"
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
