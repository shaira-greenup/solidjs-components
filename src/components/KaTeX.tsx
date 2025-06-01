import katex from "katex";
import "katex/dist/katex.min.css";
import { createEffect, createSignal } from "solid-js";

interface KaTeXProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * A React-like component for rendering mathematical expressions using KaTeX.
 *
 * @param props - The component props
 * @param props.math - The LaTeX mathematical expression to render
 * @param props.displayMode - Whether to render in display mode (block) or inline mode. Defaults to false (inline)
 * @param props.className - Optional CSS class name to apply to the container span
 * @returns A span element containing the rendered mathematical expression
 *
 * @example
 * ```tsx
 * <KaTeX math="x^2 + y^2 = z^2" displayMode={true} />
 * <KaTeX math="\frac{1}{2}" className="inline-math" />
 * ```
 */
export default function KaTeX(props: KaTeXProps) {
  const [container, setContainer] = createSignal<HTMLElement>();

  createEffect(() => {
    const element = container();
    if (element && props.math) {
      try {
        katex.render(props.math, element, {
          displayMode: props.displayMode ?? false,
          throwOnError: false,
          errorColor: "#cc0000",
          strict: "warn",
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        element.innerHTML = `<span style="color: #cc0000;">Error rendering: ${props.math}</span>`;
      }
    }
  });

  return (
    <span
      ref={setContainer}
      class={`text-black dark:text-white ${props.className || ""}`}
    />
  );
}
