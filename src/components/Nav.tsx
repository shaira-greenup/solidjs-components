import { JSXElement, Show } from "solid-js";

interface NavProps {
  sidebarOpen: () => boolean;
  toggleSidebar: () => void;
}

function MenuIcon(): JSXElement {
  return (
    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

export default function Nav(props: NavProps) {
  const MenuButton = (): JSXElement => {
    return (
      <button
        onClick={props.toggleSidebar}
        class="p-2 rounded-[var(--radius-field)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-base-200)] transition-colors lg:hidden"
      >
        <MenuIcon />
      </button>
    );
  };
  return (
    <nav class="bg-[var(--color-base-100)]/95 backdrop-blur-sm border-b border-[var(--color-base-300)] sticky top-0 z-30">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-[var(--navbar-height)] items-center justify-between">
          <LeftSideNav>
            <MenuButton />
            <h1>LHS</h1>
          </LeftSideNav>

          <CentreSideNav>
            <h1>Centre</h1>
          </CentreSideNav>

          {/* Right Side Content */}
          <RightSideNav>
            <h1>RHS</h1>
          </RightSideNav>
        </div>
      </div>
    </nav>
  );
}

function H1(props: { children?: JSXElement }) {
  return (
    <h1 class="text-xl font-bold text-[var(--color-heading)]">
      {props.children}
    </h1>
  );
}

function CentreSideNav(props: { children?: JSXElement }) {
  return (
    <div class="flex items-center justify-center flex-1">{props.children}</div>
  );
}
function LeftSideNav(props: { children?: JSXElement }) {
  return <div class="flex items-center gap-4">{props.children}</div>;
}

function RightSideNav(props: {
  children?: JSXElement;
  userOrb?: boolean;
}): JSXElement {
  return (
    <div class="flex items-center gap-3">
      <div class="hidden sm:block text-sm text-[var(--color-text-secondary)]">
        {props.children}
      </div>
      <Show when={props.userOrb}>
        <UserOrb />
      </Show>
    </div>
  );
}

function UserOrb(): JSXElement {
  return (
    <div class="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
  );
}
