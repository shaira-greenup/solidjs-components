import { createSignal, JSXElement, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import { tv } from "tailwind-variants";
import MenuIcon from "lucide-solid/icons/menu";

const styles = tv({
  slots: {
    container: "h-dvh flex flex-col",
    nav: "bg-blue-600/50 border-b px-4 h-16 flex items-center justify-between",
    button: "p-2 hover:bg-gray-100 rounded",
    title: "text-xl font-semibold",
    content: "flex flex-1 relative",
    overlay:
      "absolute inset-0 bg-black/50 sm:hidden transition-opacity duration-200",
    aside:
      "bg-red-600/50 text-white transition-all duration-200 overflow-hidden absolute sm:relative h-full",
    sidebar: "p-4 space-y-2 w-64",
    link: "block p-2 hover:bg-gray-700 rounded",
    main: "flex-1 p-6 overflow-auto bg-gray-50",
    bottomDash:
      "bg-green-600/50 border-t h-16 flex items-center justify-center sm:hidden",
  },
  variants: {
    open: {
      true: { aside: "w-64" },
      false: { aside: "w-0" },
    },
  },
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
        <div></div>
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
          <nav class={styles().sidebar()}>
            <h2 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-4">
              Menu
            </h2>
            <a href="#" class={styles().link()}>
              Dashboard
            </a>
            <a href="#" class={styles().link()}>
              Projects
            </a>
            <a href="#" class={styles().link()}>
              Settings
            </a>
          </nav>
        </aside>

        <main class={styles().main()}>{props.children}</main>
      </div>

      <div class={styles().bottomDash()}>
        <button onclick={() => setOpen(!open())} class={styles().button()}>
          <MenuIcon size={20} />
        </button>
      </div>
    </div>
  );
}
