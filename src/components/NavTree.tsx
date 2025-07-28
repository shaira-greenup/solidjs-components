// import { Wunderbaum } from "wunderbaum";
// npm install bootstrap-icons
import { useNavigate } from "@solidjs/router";
import "bootstrap-icons/font/bootstrap-icons.css";
import { onMount } from "solid-js";
//  npm install --save @fortawesome/fontawesome-free
import "@fortawesome/fontawesome-free/css/all.css";
import { WbCancelableEventResultType, WbKeydownEventType } from "types";
import { WunderbaumNode } from "wb_node";
import { Wunderbaum } from "wunderbaum";

const data = [
  {
    title: "Navigation",
    expanded: true,
    children: [
      {
        title: "Home",
        content: "Home Page",
        link: "/",
      },
      {
        title: "About",
        content: "About Page",
        link: "about",
      },
    ],
  },
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
            title: "Chart",
            content: "Example of a Chart",
            link: "static_chart",
          },
          {
            title: "Slider",
            content: "Example of a Slider",
            link: "slider_example",
          },
          {
            title: "KaTeX",
            content: "Example of KaTeX",
            link: "katex",
          },
          {
            title: "CK Editor 5",
            content: "Example of CK Editor",
            link: "ckeditor",
          },

          {
            title: "Full Calendar io",
            content: "Example of Full Calendar IO",
            link: "calendar",
          },
          {
            title: "Tailwind Sidebar",
            content: "Example of Tailwind Sidebar",
            link: "tailwind_sidebar",
          },
          {
            title: "Radial Context Menu",
            content: "Radial Context Menu minimizes right click distance",
            link: "radial_menu/radial_menu",
          },
          {
            title: "Command Palette",
            content: "Professional command palette with fuzzy search",
            link: "command_palette",
          },
          {
            title: "Date Picker",
            content: "Interactive date picker with keyboard navigation",
            link: "date_picker",
          },
          {
            title: "Carousel",
            content: "Image carousel with navigation controls and indicators",
            link: "carousel",
          },
        ],
      },
    ],
  },

  {
    title: "Layouts",
    expanded: true,
    children: [
      {
        title: "Overview",
        content: "",
        link: "layout_examples/overview",
      },
      {
        title: "Accordian",
        content:
          "An accordian layout, benefit of this is it's extremely simple",
        link: "layout_examples/accordian/accordian_example",
      },
      {
        title: "Side Drawer With Sidebar",
        expanded: true,
        children: [
          {
            title: "Sandbox",
            content: "",
            link: "layout_examples/side_drawer/side_drawer_sandbox",
          },
          {
            title: "Polished",
            content: "",
            link: "layout_examples/side_drawer/side_drawer_polished",
          },
        ],
      },
      {
        title: "Bottom Drawer With Sidebar",
        expanded: true,
        children: [
          {
            title: "Sandbox",
            content: "",
            link: "layout_examples/bottom_drawer/sandbox_bottom_drawer",
          },
          {
            title: "Polished",
            content: "",
            link: "layout_examples/bottom_drawer/polished_bottom_drawer",
          },
        ],
      },
    ],
  },

  {
    title: "DataTables",
    expanded: true,
    children: [
      {
        title: "TanStack",
        expanded: true,
        children: [
          {
            title: "In Place",
            expanded: true,
            children: [
              {
                title: "Simple",
                content: "Example of Tanstack Sidebar",
                link: "datatable",
              },
              {
                title: "Sortable",
                content: "Example of Tanstack Sidebar",
                link: "datatable_sortable",
              },
              {
                title: "Paginated",
                content: "Example of Tanstack Sidebar",
                link: "datatable_paginated",
              },
            ],
          },
          {
            title: "Component",
            expanded: true,
            children: [
              {
                title: "Paginated Using Component",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_paginated",
              },
              {
                title: "Dynamic",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_dynamic",
              },
              {
                title: "With Chart",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_dynamic_with_chart",
              },
              {
                title: "SQLite",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_paginated_sqlite",
              },
              {
                title: "SQLite With Chart",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_paginated_sqlite_with_chart",
              },
              {
                title: "Virtual Scrolling Using Component",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_virtual_scroll",
              },
              {
                title: "Virtual Scrolling Using Component",
                content: "Example of Tanstack Sidebar",
                link: "datatable_component_examples/datatable_virtual_scroll_keyboard",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    title: "Virtualization Revisited",
    expanded: true,
    children: [
      {
        title: "Virtual Scrolling Using Component",
        content: "Example of Tanstack Virtual List",
        link: "virtualization_revisited/virtual_list",
      },
      {
        title: "Virtual Scrolling Plain Table",
        content: "Example of Tanstack Sidebar",
        link: "virtualization_revisited/virtual_normal_table",
      },
    ],
  },

  {
    title: "Compositional Content",
    expanded: true,
    children: [
      {
        title: "Dynamic Chart",
        content: "Example of a Chart",
        link: "dynamicChart",
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
      keydown: (e: WbKeydownEventType): WbCancelableEventResultType => {
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
