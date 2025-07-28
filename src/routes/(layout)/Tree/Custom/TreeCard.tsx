import { JSX } from "solid-js";

interface TreeCardProps {
  title: string;
  children: JSX.Element;
  class?: string;
}

export function TreeCard(props: TreeCardProps) {
  return (
    <div class={`card bg-base-100 shadow-xl ${props.class || ""}`}>
      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
}
