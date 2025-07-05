import { A, useLocation } from "@solidjs/router";
import type { JSX } from "solid-js";
import { Show, onMount, onCleanup, createEffect } from "solid-js";
import NavTree from "~/components/NavTree";
import { isSidebarToggleKey } from "~/utils/keybindings";

interface SidebarProps {
  isOpen: () => boolean;
  toggle: () => void;
}

// Icon components
interface SvgIconProps {
  class?: string;
  children: JSX.Element;
}

function SvgIcon(props: SvgIconProps): JSX.Element {
  return (
    <svg
      class={props.class || "mr-3 flex-shrink-0 h-5 w-5"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {props.children}
    </svg>
  );
}

function DashboardIcon(): JSX.Element {
  return (
    <SvgIcon>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
      />
    </SvgIcon>
  );
}

function AboutIcon(): JSX.Element {
  return (
    <SvgIcon>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </SvgIcon>
  );
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: DashboardIcon,
  },
  {
    name: "About",
    href: "/about",
    icon: AboutIcon,
  },
];

interface NavigationItemProps {
  item: {
    name: string;
    href: string;
    icon: () => JSX.Element;
  };
  isActive: boolean;
  onNavigate: () => void;
}

function NavigationItem(props: NavigationItemProps): JSX.Element {
  return (
    <A
      href={props.item.href}
      onClick={props.onNavigate}
      classList={{
        "group flex items-center px-3 py-2 text-sm font-medium rounded-[var(--radius-field)] transition-colors": true,
        "bg-[var(--color-primary)]/10 text-[var(--color-text-primary)] border-r-2 border-[var(--color-primary)]":
          props.isActive,
        "text-[var(--color-text-secondary)] hover:bg-[var(--color-base-300)] hover:text-[var(--color-text-primary)]":
          !props.isActive,
      }}
    >
      <div
        classList={{
          "text-[var(--color-primary)]": props.isActive,
          "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]":
            !props.isActive,
        }}
      >
        <props.item.icon />
      </div>
      {props.item.name}
    </A>
  );
}

export default function Sidebar(props: SidebarProps) {
  const location = useLocation();
  let navTreeRef: HTMLElement | undefined;

  // Should be positioned under the navbar
  // When true, the sidebar will inherit the navbar height from app.css
  // We don't want that for the current design
  const isUnderNavbar = false;
  const enableBackgroundBlur = false;
  const closeOnItemClick = false;

  // Focus NavTree when sidebar opens for accessibility
  createEffect(() => {
    if (props.isOpen() && navTreeRef) {
      // Use setTimeout to ensure the sidebar transition has started
      setTimeout(() => {
        // Focus the first focusable element within NavTree
        const firstFocusable = navTreeRef?.querySelector(
          'a, button, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 50);
    }
  });

  // Handle escape key to close sidebar on mobile
  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && props.isOpen()) {
        // Only close if we're in mobile view (sidebar is overlay)
        if (window.innerWidth < 1024) {
          props.toggle();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <>
      <Show when={props.isOpen()}>
        <div
          classList={{
            "fixed inset-0 bg-[var(--color-neutral)]/50 z-40 lg:hidden": true,
            "backdrop-blur-sm": enableBackgroundBlur,
          }}
          onClick={props.toggle}
        />
      </Show>

      <div
        classList={{
          "fixed top-0 left-0 bottom-0 bg-[var(--color-base-200)] border-r border-[var(--color-base-300)] z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0": true,
          "translate-x-0": props.isOpen(),
          "-translate-x-full": !props.isOpen(),
          "top-[var(--navbar-height)]": false,
          "w-[var(--sidebar-width)]": true,
        }}
      >
        <div class="flex h-full flex-col">
          <div class="flex flex-1 flex-col pb-4 overflow-y-auto">
            {/* mt-2 pushes the content down a little bit */}
            <nav class="mt-4 flex-1 px-2 space-y-1" ref={navTreeRef}>
              <NavTree
                onItemClick={closeOnItemClick ? props.toggle : undefined}
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
