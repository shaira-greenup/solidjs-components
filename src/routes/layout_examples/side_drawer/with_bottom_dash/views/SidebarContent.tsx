import { For } from "solid-js";

const SidebarContent = () => {
  return (
    <div class="prose dark:prose-invert">
      <ul>
        <For each={Array.from({ length: 300 }, (_, i) => i + 1)}>
          {(i) => <li>List item {i}</li>}
        </For>
      </ul>
      :way[]
    </div>
  );
};

export default SidebarContent;
