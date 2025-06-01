// import { Wunderbaum } from "wunderbaum";
// npm install bootstrap-icons
import "bootstrap-icons/font/bootstrap-icons.css";
import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
//  npm install --save @fortawesome/fontawesome-free
import "@fortawesome/fontawesome-free/css/all.css";
import { WbKeydownEventType } from "types";
import { WunderbaumNode } from "wb_node";
import { Wunderbaum } from "wunderbaum";

const data = [
  {
    title: "Core Content",
    expanded: true,
    children: [
      {
        title: "Components",
        expanded: true,
        children: [
          {
            title: "Splitter",
            content: "A Splitter like the Qt Splitter",
            link: "splitter",
          },
          {
            title: "Layout",
            content: "A Layout Example",
            link: "layout",
          },
          {
            title: "Home",
            content: "Home Page",
            link: "home",
          },
          {
            title: "About",
            content: "About Page",
            link: "about",
          },
        ],
      },
    ],
  },
];

export default function NavTree() {
  let tree_ref!: HTMLDivElement;
  let treeInstance: Wunderbaum | null = null;
  const navigate = useNavigate();

  let getNode = (e: MouseEvent): WunderbaumNode | null => {
    return null;
  };

  const onGetProperties = (e: MouseEvent) => {
    // const node: WunderbaumNode = treeInstance?.constructor.getNode(e) || null;
    const node: WunderbaumNode | null = getNode(e);
    if (node) {
      alert(
        `Node details: ${JSON.stringify(
          {
            key: node?.key,
            title: node?.title,
            type: node?.type,
          },
          null,
          2,
        )}`,
      );
    } else {
      alert("The node is null");
    }
  };

  const items = [
    {
      label: "Edit",
      icon: "✏️",
      onClick: () => alert("Edit"),
    },
    {
      label: "Copy",
      icon: "📋",
      onClick: () => alert("Copy"),
    },
    {
      label: "Delete",
      icon: "🗑️",
      onClick: () => alert("Delete"),
    },
    {
      label: "Properties",
      icon: "ℹ️",
      onClick: (e: MouseEvent) => {
        onGetProperties(e);
      },
    },
  ];

  onMount(async () => {
    const { Wunderbaum } = await import("wunderbaum");

    getNode = (e: MouseEvent) => {
      console.log(e);
      return Wunderbaum.getNode(e);
    };

    treeInstance = new Wunderbaum({
      element: tree_ref,
      source: data,
      iconMap: "fontawesome6",
      init: (e) => {
        e.tree.setFocus();
      },
      activate: (e) => {
        // alert(`Opened: ${e.node.title}`);
        if (e.node.data?.link) {
          navigate(e.node.data.link);
        }
      },
      keydown: (e: WbKeydownEventType) => {
        switch (e.event.key) {
          case "j":
            if (!e.tree.isEditingTitle()) {
              replaceKeyPress(e.event, e.tree.element, "ArrowDown");
              return false;
            }
          case "k":
            if (!e.tree.isEditingTitle()) {
              replaceKeyPress(e.event, e.tree.element, "ArrowUp");
              return false;
            }
          case "h":
            if (!e.tree.isEditingTitle()) {
              replaceKeyPress(e.event, e.tree.element, "ArrowLeft");
              return false;
            }
          case "l":
            if (!e.tree.isEditingTitle()) {
              replaceKeyPress(e.event, e.tree.element, "ArrowRight");
              return false;
            }
        }
      },

      render: (e) => {
        // Add custom styling for different node types
        const node = e.node;
        const nodeElement = e.nodeElem;
        const rowElement = nodeElement?.closest(".wb-row") as HTMLElement;

        // Add hover effects and modern styling
        if (nodeElement) {
          nodeElement.style.borderRadius = "4px";
          nodeElement.style.transition = "all 0.15s ease";
          // Ensure the node key is available for retrieval
          if (node?.key) {
            nodeElement.setAttribute("data-key", node.key);
          }
        }
      },
    });
  });

  return (
    <div
      class="h-screen p-4
      bg-[var(--color-base-100)]
      dark:bg-[var(--color-base-100)]
      text-[var(--foreground-rgb)]
      dark:text-[var(--foreground-rgb)]
      font-sans
      outline-none"
    >
      <div
        ref={tree_ref}
        class="wb-skeleton wb-initializing wb-fade-expander wb-no-select outline-none"
      />
    </div>
  );
}

function replaceKeyPress(
  event: KeyboardEvent,
  element: HTMLDivElement,
  key: string,
) {
  // Prevent default behavior (like scrolling)
  event.preventDefault();
  // Simulate down arrow key press
  const downEvent = new KeyboardEvent("keydown", {
    key: key,
  });
  element.dispatchEvent(downEvent);
}
