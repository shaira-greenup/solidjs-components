import { JSX } from "solid-js";

export interface StatusDisplayProps {
  title: string;
  data: any;
  class?: string;
}

export const StatusDisplay = (props: StatusDisplayProps) => {
  return (
    <div class={props.class}>
      <h3 class="font-semibold text-sm text-base-content/70 mb-2">
        {props.title}
      </h3>
      <div class="bg-base-300 rounded-lg p-3 border border-base-content/10">
        <pre class="text-xs text-base-content whitespace-pre-wrap break-words">
          <code class="text-base-content">
            {props.data ? JSON.stringify(props.data, null, 2) : "null"}
          </code>
        </pre>
      </div>
    </div>
  );
};
