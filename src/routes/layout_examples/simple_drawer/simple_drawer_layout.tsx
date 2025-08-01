import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  Accessor,
  createSignal,
  JSXElement,
  Setter,
  Show,
  Suspense,
} from "solid-js";
import { Transition } from "solid-transition-group";
import { tv } from "tailwind-variants";
import MenuIcon from "lucide-solid/icons/menu";

const nav = tv({ base: "bg-base-200 h-12 flex items-center px-4 z-20" });
const aside = tv({
  base: "bg-base-200 transition-all overflow-hidden z-10 absolute sm:relative h-full",
  variants: {
    open: { true: "w-64", false: "w-0" },
  },
});
const overlay = tv({
  base: "absolute inset-0 bg-black/50 sm:hidden transition-opacity duration-300",
});
const bottomNav = tv({
  base: "bg-base-200 h-12 flex items-center justify-center sm:hidden z-20",
});

export function SimpleDrawer(props: { children: JSXElement }) {
  const [open, setOpen] = createSignal(false);
  const toggleSidebar = () => {
    setOpen(!open());
  };
  return (
    // Mobile browsers show/hide address bar on scroll, affecting viewport height.
    // Using h-dvh (dynamic viewport height) instead of h-screen ensures proper sizing.
    <div class="h-dvh flex flex-col">
      <Nav toggleSidebar={toggleSidebar} />
      <div class="flex flex-1 relative">
        <Overlay open={open} setOpen={setOpen} />
        <aside class={aside({ open: open() })}>
          <SidebarContent />
        </aside>
        <main class="flex-1 p-4">
          <Suspense>{props.children}</Suspense>
        </main>
      </div>
      <MobileDash toggleSidebar={toggleSidebar} />
    </div>
  );
}

const MobileDash = (props: { toggleSidebar: () => void }) => {
  return (
    <div class={bottomNav()}>
      <MenuButton onClick={props.toggleSidebar} />
    </div>
  );
};

const Overlay = (props: {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
}) => {
  return (
    <Transition
      enterClass="opacity-0"
      enterToClass="opacity-100"
      exitClass="opacity-100"
      exitToClass="opacity-0"
    >
      <Show when={props.open()}>
        <div class={overlay()} onclick={() => props.setOpen(false)} />
      </Show>
    </Transition>
  );
};

const MenuButton = (props: { onClick: () => void }) => {
  return (
    <button
      onclick={props.onClick}
      class="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
    >
      <MenuIcon />
    </button>
  );
};

const Nav = (props: { toggleSidebar: () => void }) => {
  return (
    <nav class={nav()}>
      <MenuButton onClick={props.toggleSidebar} />
      <NavContent />
    </nav>
  );
};

const NavContent = () => {
  return (
    <div class="prose dark:prose-invert">
      <p> Add some Nav Content </p>
    </div>
  );
};


const SidebarContent = () => {
  return (
    <nav>
      <ul class="menu">
        <li>
          <a href="#" class="block p-2 hover:bg-red-500/20 rounded">
            Item 1
          </a>
        </li>
        <li>
          <details class="group">
            <summary class="p-2 hover:bg-red-500/20 rounded cursor-pointer">
              Parent Item
            </summary>
            <ul class="ml-4 mt-1 space-y-1">
              <li>
                <a href="#" class="block p-2 hover:bg-red-500/20 rounded text-sm">
                  Submenu 1
                </a>
              </li>
              <li>
                <a href="#" class="block p-2 hover:bg-red-500/20 rounded text-sm">
                  Submenu 2
                </a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <a href="#" class="block p-2 hover:bg-red-500/20 rounded">
            Item 3
          </a>
        </li>
      </ul>
    </nav>
  );
};
