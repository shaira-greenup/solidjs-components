import { Accordion } from "@kobalte/core/accordion";
import { ChevronDownIcon } from "lucide-solid";
import { tv } from "tailwind-variants";

const accordion = tv({
  slots: {
    root: "rounded-md w-[300px] border border-gray-300 text-gray-900",
    item: "first:rounded-t-md last:rounded-b-md border-b border-gray-300 last:border-b-0",
    header: "flex",
    trigger: [
      "inline-flex items-center justify-between w-full p-3.5",
      "font-semibold text-left outline-none",
      "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
    ],
    icon: [
      "w-6 h-6 transition-transform duration-300",
      "data-[expanded]:rotate-180"
    ],
    content: [
      "overflow-hidden text-base",
      "data-[expanded]:animate-[slideDown_300ms_cubic-bezier(0.87,0,0.13,1)]",
      "animate-[slideUp_300ms_cubic-bezier(0.87,0,0.13,1)]"
    ],
    contentText: "p-4"
  }
});

const styles = accordion();

export default function App() {
  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { height: 0; }
          to { height: var(--kb-accordion-content-height); }
        }
        @keyframes slideUp {
          from { height: var(--kb-accordion-content-height); }
          to { height: 0; }
        }
      `}</style>
      <Accordion class={styles.root()} defaultValue={["item-1"]}>
        <Accordion.Item class={styles.item()} value="item-1">
          <Accordion.Header class={styles.header()}>
            <Accordion.Trigger class={styles.trigger()}>
              <span>Is it accessible?</span>
              <ChevronDownIcon class={styles.icon()} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class={styles.content()}>
            <p class={styles.contentText()}>
              Yes. It adheres to the WAI-ARIA design pattern.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item class={styles.item()} value="item-2">
          <Accordion.Header class={styles.header()}>
            <Accordion.Trigger class={styles.trigger()}>
              <span>Is it unstyled?</span>
              <ChevronDownIcon class={styles.icon()} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class={styles.content()}>
            <p class={styles.contentText()}>
              Yes. It's unstyled by default, giving you freedom over the look and
              feel.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item class={styles.item()} value="item-3">
          <Accordion.Header class={styles.header()}>
            <Accordion.Trigger class={styles.trigger()}>
              <span>Can it be animated?</span>
              <ChevronDownIcon class={styles.icon()} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class={styles.content()}>
            <p class={styles.contentText()}>
              Yes! You can animate the Accordion with CSS or JavaScript.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
