import { JSX, ParentProps } from "solid-js";

interface CardProps extends ParentProps {
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerContent?: JSX.Element;
}

export default function Card(props: CardProps) {
  return (
    <div
      class={`overflow-hidden rounded-lg bg-[var(--color-base-100)] shadow ${props.className || ""}`}
    >
      {props.title && (
        <div
          class={`border-b border-[var(--color-base-300)] px-4 py-5 sm:px-6 ${props.headerClassName || ""}`}
        >
          <h3 class="text-lg font-medium leading-6 text-[var(--color-base-content)]">
            {props.title}
          </h3>
        </div>
      )}
      <div class={`px-4 py-5 sm:p-6 ${props.bodyClassName || ""}`}>
        {props.children}
      </div>
      {props.footerContent && (
        <div class="border-t border-[var(--color-base-300)] px-4 py-4 sm:px-6">
          {props.footerContent}
        </div>
      )}
    </div>
  );
}
