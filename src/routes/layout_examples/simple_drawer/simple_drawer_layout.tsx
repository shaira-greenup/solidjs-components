import { createSignal, JSXElement, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import { tv } from "tailwind-variants";
import MenuIcon from "lucide-solid/icons/menu";

const styles = tv({
  slots: {
    container: "h-screen flex flex-col",
    nav: "bg-red-600/50 border-b px-4 h-16 flex items-center justify-between z-30",
    button: "p-2 hover:bg-gray-100 rounded",
    title: "text-xl font-semibold",
    spacer: "w-10",
    content: "flex flex-1 relative",
    overlay: "absolute inset-0 bg-black/50 md:hidden z-10 transition-opacity duration-200",
    aside: "bg-blue-600/50 text-white transition-all duration-200 z-20 overflow-hidden absolute md:relative h-full",
    sidebarHeader: "p-4 border-b border-gray-700 w-64",
    sidebarTitle: "text-lg font-semibold",
    sidebarNav: "p-4 space-y-2 w-64",
    sidebarLink: "block p-2 hover:bg-gray-700 rounded",
    main: "flex-1 p-6 overflow-auto bg-gray-50 min-w-0",
    bottomDash: "bg-green-600/50 border-t px-4 h-16 flex items-center justify-center md:hidden z-30"
  },
  variants: {
    open: {
      true: { aside: "w-64" },
      false: { aside: "w-0" }
    }
  }
});

export function SimpleDrawer(props: { children: JSXElement }) {
  const [open, setOpen] = createSignal(false);

  return (
    <div class={styles().container()}>
      <nav class={styles().nav()}>
        <button onclick={() => setOpen(!open())} class={styles().button()}>
          <MenuIcon size={20} />
        </button>
        <h1 class={styles().title()}>App Title</h1>
        <div class={styles().spacer()}></div>
      </nav>

      <div class={styles().content()}>
        <Transition
          enterClass="opacity-0"
          enterToClass="opacity-100"
          exitClass="opacity-100"
          exitToClass="opacity-0"
        >
          <Show when={open()}>
            <div class={styles().overlay()} onclick={() => setOpen(false)} />
          </Show>
        </Transition>

        <aside class={styles({ open: open() }).aside()}>
          <div class={styles().sidebarHeader()}>
            <h2 class={styles().sidebarTitle()}>Menu</h2>
          </div>
          <nav class={styles().sidebarNav()}>
            <a href="#" class={styles().sidebarLink()}>Dashboard</a>
            <a href="#" class={styles().sidebarLink()}>Projects</a>
            <a href="#" class={styles().sidebarLink()}>Settings</a>
          </nav>
        </aside>

        <main class={styles().main()}>
          {props.children}
        </main>
      </div>

      <div class={styles().bottomDash()}>
        <button onclick={() => setOpen(!open())} class={styles().button()}>
          <MenuIcon size={20} />
        </button>
      </div>
    </div>
  );
}
