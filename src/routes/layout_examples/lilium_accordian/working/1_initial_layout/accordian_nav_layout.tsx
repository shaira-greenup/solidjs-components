import { createSignal } from "solid-js";
import { tv } from "tailwind-variants";

const layout = tv({
  slots: {
    container: "flex flex-col md:flex-row min-h-screen",
    nav: "bg-gray-800 text-white md:w-64 md:flex-shrink-0",
    toggle: "w-full p-4 text-left md:hidden",
    content: "flex-col p-4 hidden md:flex",
    link: "py-2 hover:text-gray-300",
    main: "flex-1 p-8 bg-gray-50"
  },
  variants: {
    open: {
      true: {
        content: "flex"
      }
    }
  }
});

export default function AccordionNavLayout() {
  const [isOpen, setIsOpen] = createSignal(false);
  const styles = layout();

  return (
    <div class={styles.container()}>
      <nav class={styles.nav()}>
        <button 
          class={styles.toggle()}
          onClick={() => setIsOpen(!isOpen())}
        >
          Menu {isOpen() ? "▲" : "▼"}
        </button>
        <div class={styles.content({ open: isOpen() })}>
          <a href="#" class={styles.link()}>Home</a>
          <a href="#" class={styles.link()}>About</a>
          <a href="#" class={styles.link()}>Projects</a>
          <a href="#" class={styles.link()}>Contact</a>
        </div>
      </nav>
      
      <main class={styles.main()}>
        <h1 class="text-2xl font-bold mb-4">Main Content</h1>
        <p class="mb-2">This content automatically adjusts when the nav opens/closes.</p>
        <p>On larger screens, the nav becomes a sidebar.</p>
      </main>
    </div>
  );
}