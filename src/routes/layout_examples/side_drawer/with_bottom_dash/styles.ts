import { tv } from "tailwind-variants";

/**
 * It will be decessary to ensure all animations align so the margins etc. remain smooth
 *
 */
export const ANIMATION = "transition-all duration-200 ease-in-out";

export const Z_INDICES = {
  mobileDrawer: "z-50",
  topHeader: "z-10",
  bottomHeader: "z-50",
  overlay: "z-40",
  sidebar: "z-10",
};

export const overlaySty = tv({
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

export const navbarSty = tv({
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

export const buttonSty = tv({
  base: "flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 h-full transition-colors",
});

export const sidebarSty = tv({
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
      false: ANIMATION,
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

export const resizeHandleSty = tv({
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

export const MainContentSty = tv({
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

export const bottomDashSty = tv({
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
