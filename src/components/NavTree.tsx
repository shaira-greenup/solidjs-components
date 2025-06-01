// import { Wunderbaum } from "wunderbaum";
// npm install bootstrap-icons
import "bootstrap-icons/font/bootstrap-icons.css";
import { onMount } from "solid-js";
//  npm install --save @fortawesome/fontawesome-free
import "@fortawesome/fontawesome-free/css/all.css";
import { WbKeydownEventType } from "types";
import { WunderbaumNode } from "wb_node";
import { Wunderbaum } from "wunderbaum";

const data = [
  {
    title: "📝 My Notes",
    expanded: true,
    children: [
      {
        title: "📄 Meeting Notes",
        children: [
          {
            title: "Daily Standup - Jan 15",
            content: "Discussed project updates and blockers.",
          },
          {
            title: "Project Review - Jan 12",
            content: "Reviewed project milestones and feedback.",
          },
          {
            title: "Sprint Planning - Jan 10",
            content: "Planned tasks for the upcoming sprint.",
          },
          {
            title: "Client Call - Jan 8",
            content: "Discussed client requirements and deliverables.",
          },
        ],
      },
      {
        title: "💡 Ideas",
        children: [
          {
            title: "App Feature Concepts",
            content: "Feature ideas for enhancing user engagement.",
          },
          {
            title: "Design Improvements",
            content: "Potential UI/UX improvements based on feedback.",
          },
          {
            title: "Automation Tools",
            content: "Explorations into automating repetitive tasks.",
          },
        ],
      },
      {
        title: "🛠 Troubleshooting",
        children: [
          {
            title: "Debugging Tips",
            content: "Common debugging techniques and tools.",
          },
          {
            title: "Common Error Messages",
            content: "Solutions for frequently occurring errors.",
          },
        ],
      },
    ],
  },
  {
    title: "📚 Resources",
    expanded: false,
    children: [
      {
        title: "Documentation Links",
        content: "Links to official docs for frameworks and tools.",
      },
      {
        title: "Code Snippets",
        content: "Reusable code snippets for various programming tasks.",
      },
      {
        title: "Tutorials",
        content: "List of tutorials for learning new technologies.",
      },
      {
        title: "Books",
        content: "Recommendations for tech-related books to read.",
      },
    ],
  },
  {
    title: "✅ Tasks",
    expanded: false,
    children: [
      {
        title: "Complete project setup",
        content: "Setup project environment and dependencies.",
      },
      {
        title: "Review pull requests",
        content: "Ensure code quality and functionality.",
      },
      {
        title: "Update documentation",
        content: "Revise project documentation with recent changes.",
      },
      {
        title: "Test new features",
        content: "Conduct tests to ensure new features work as intended.",
      },
    ],
  },
  {
    title: "📈 Personal Development",
    children: [
      {
        title: "Learning Goals",
        children: [
          {
            title: "Master TypeScript",
            content: "Enhance skills in TypeScript by mid-year.",
          },
          {
            title: "Contribute to Open Source",
            content: "Aim to contribute to at least two projects.",
          },
        ],
      },
      {
        title: "Career Goals",
        children: [
          {
            title: "Prepare for Certification",
            content: "Study for cloud certification exams.",
          },
          {
            title: "Networking",
            content: "Attend meetups and conferences regularly.",
          },
        ],
      },
    ],
  },
];

export default function Home() {
  let tree_ref!: HTMLDivElement;
  let treeInstance: Wunderbaum | null = null;

  let getNode = (e: MouseEvent): WunderbaumNode | null => {
    return null;
  };

  const onGetProperties = (e: MouseEvent) => {
    // const node: WunderbaumNode = treeInstance?.constructor.getNode(e) || null;
    const node: WunderbaumNode = getNode(e);
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
        console.log(`Opened: ${e.node.title}`);
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
      <h1>Hi</h1>
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
