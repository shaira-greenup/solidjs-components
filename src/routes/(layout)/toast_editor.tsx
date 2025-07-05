import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { marked } from "marked";
import { evaluate } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "solid-js/h/jsx-runtime";
import { isServer } from "solid-js/web";

const useMDX = true;

function Card(props: { title: string; children: any; class?: string }) {
  return (
    <div
      class={`mt-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${props.class || ""}`}
    >
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {props.title}
      </h3>
      {props.children}
    </div>
  );
}

function MarkdownPreview(props: { content: string }) {
  const [renderedHtml, setRenderedHtml] = createSignal("");
  const [MdxComponent, setMdxComponent] = createSignal<any>(null);

  createEffect(() => {
    const renderMarkdown = async () => {
      try {
        if (useMDX) {
          // Evaluate the MDX and get the component
          const { default: Content } = await evaluate(props.content, {
            Fragment,
            jsx,
            jsxs,
            useMDXComponents: () => ({}),
          });

          // Store the component for rendering
          setMdxComponent(() => Content);
          setRenderedHtml("");
        } else {
          const html = await marked(props.content);
          setRenderedHtml(html);
          setMdxComponent(null);
        }
      } catch (error) {
        console.error("Markdown rendering error:", error);
        setRenderedHtml(props.content);
        setMdxComponent(null);
      }
    };

    renderMarkdown();
  });

  return (
    <Card title="Markdown Preview" class="h-96 overflow-auto">
      <div class="prose prose-sm dark:prose-invert max-w-none">
        <Show when={useMDX && MdxComponent()}>
          {/* Must evaluate the component directly to avoid need of server-side rendering */}
          {MdxComponent()()}
        </Show>
        <Show when={!useMDX || !MdxComponent()}>
          <div innerHTML={renderedHtml()}></div>
        </Show>
      </div>
    </Card>
  );
}

function MarkdownSource(props: { content: string }) {
  return (
    <Card title="Markdown Source" class="h-96 overflow-auto">
      <pre class="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto border border-gray-200 dark:border-gray-600 font-mono text-xs whitespace-pre-wrap">
        <code>{props.content}</code>
      </pre>
    </Card>
  );
}

export default function MarkdownEditor() {
  let editorRef!: HTMLDivElement;
  const [isMounted, setIsMounted] = createSignal(false);
  const [content, setContent] = createSignal("");
  const [markdownContent, setMarkdownContent] = createSignal("");
  const [showPreview, setShowPreview] = createSignal(true);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  let editorInstance: any = null;

  // Set up dark mode detection
  onMount(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      // Update Toast Editor theme when dark mode changes
      if (editorInstance) {
        editorInstance.destroy();
        initializeToastEditor();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    onCleanup(() => {
      mediaQuery.removeEventListener("change", handleChange);
      if (editorInstance) {
        editorInstance.destroy();
      }
    });
  });

  const initializeToastEditor = async () => {
    if (isServer) return;

    try {
      // Dynamic import to ensure it only runs on client
      const { default: Editor } = await import("@toast-ui/editor");
      await import("@toast-ui/editor/dist/toastui-editor.css");
      await import("@toast-ui/editor/dist/theme/toastui-editor-dark.css");

      editorInstance = new Editor({
        el: editorRef,
        height: '400px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        theme: isDarkMode() ? 'dark' : 'light',
        initialValue: '# Welcome to the Toast Editor\n\nStart writing your content here. This editor supports **bold**, *italic*, `inline code`, and much more!\n\n> Use the toolbar above to access all formatting options.\n\n## MDX Component Example\n\nYou can embed React-like components in your markdown:\n\n```jsx\nexport function Alert({ children, type = "info" }) {\n  return (\n    <div className={`alert alert-${type}`}>\n      {children}\n    </div>\n  );\n}\n\n<Alert type="success">\n  🎉 This is a custom component rendered in markdown!\n</Alert>\n```\n\nThis combines the power of markdown with interactive components!',
        events: {
          change: () => {
            const markdownContent = editorInstance!.getMarkdown();
            const htmlContent = editorInstance!.getHTML();
            setContent(htmlContent);
            setMarkdownContent(markdownContent);
          }
        }
      });
    } catch (error) {
      console.error("Failed to initialize Toast Editor:", error);
    }
  };

  onMount(async () => {
    if (!isServer) {
      setIsMounted(true);
      await initializeToastEditor();
    }
  });

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Toast Editor - Markdown Editor
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            A full-featured WYSIWYG editor with markdown support and live
            preview
          </p>
          <div class="mt-4">
            <button
              onClick={() => setShowPreview(!showPreview())}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showPreview() ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        </div>

        <Show
          when={isMounted()}
          fallback={
            <div class="flex items-center justify-center h-64">
              <div class="text-lg text-gray-600 dark:text-gray-400">
                Loading editor...
              </div>
            </div>
          }
        >
          <div
            class={`grid gap-6 ${showPreview() ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
          >
            <Card title="Editor" class="min-h-96">
              <div class="prose">
                <div
                  ref={editorRef}
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
                />
              </div>
            </Card>

            <Show when={showPreview()}>
              <div class="space-y-6">
                <MarkdownPreview content={content()} />
                <MarkdownSource content={markdownContent()} />
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export function Alert({ children, type = "info" }) {
  let backgroundColor;
  switch (type) {
    case "success":
      backgroundColor = "#d4edda";
      break;
    case "warning":
      backgroundColor = "#fff3cd";
      break;
    case "danger":
      backgroundColor = "#f8d7da";
      break;
    default:
      backgroundColor = "#d1ecf1"; // default "info" type
  }

  return (
    <div style={`background-color: ${backgroundColor}; padding: 10px; border-radius: 5px;`}>
      {children}
    </div>
  );
}
