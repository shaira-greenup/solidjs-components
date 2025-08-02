import { For } from "solid-js";

const Article = () => {
  // Create an array for the range 1 to 10.
  const range = Array.from({ length: 10 }, (_, i) => i + 1);

  const Kbd = (props: { children: any }) => {
    return (
      <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
        {props.children}
      </kbd>
    );
  };

  return (
    <div class="prose dark:prose-invert">
      <h2>Keyboard Shortcuts</h2>
      <div class="mb-6">
        <p>Use the following keyboard shortcuts to control the layout:</p>
        <ul>
          <li>
            <Kbd>1</Kbd> or <Kbd>Ctrl+1</Kbd> - Toggle sidebar/drawer visibility
          </li>
          <li>
            <Kbd>2</Kbd> or <Kbd>Ctrl+2</Kbd> - Toggle top navigation bar
          </li>
          <li>
            <Kbd>3</Kbd> or <Kbd>Ctrl+3</Kbd> - Toggle bottom dashboard
          </li>
        </ul>
      </div>

      <For each={range}>
        {(item) => (
          <div>
            <h1>Main Content Area {item}</h1>
            <p>
              This content area adjusts based on the sidebar and header
              visibility.
            </p>
            <div>
              <p>Current layout state:</p>
              <ul>{/* List items can be generated here if required */}</ul>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default Article;
