import { createSignal, createEffect, Show, JSX } from "solid-js";
import { compile, run } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "solid-jsx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

interface MdxEditorProps {
  initialContent?: string;
  components?: Record<string, any>;
  className?: string;
  editorClassName?: string;
  previewClassName?: string;
}

export default function MdxEditor(props: MdxEditorProps) {
  const [mdxContent, setMdxContent] = createSignal(props.initialContent || "# Hello MDX\n\nType your content here...");
  const [previewContent, setPreviewContent] = createSignal<any>(null);
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(async () => {
    const source = mdxContent();

    if (!source.trim()) {
      setPreviewContent(null);
      setError("");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const compiled = await compile(source, {
        outputFormat: "function-body",
        development: false,
        jsxImportSource: "solid-jsx",
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex, rehypeHighlight],
      });

      const { default: MDXContent } = await run(compiled, {
        jsx,
        jsxs,
        Fragment,
        ...props.components,
        baseUrl: import.meta.url,
      });

      setPreviewContent(() => MDXContent);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setPreviewContent(null);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div class={`h-full flex ${props.className || ""}`}>
      {/* Editor Panel */}
      <div class="w-1/2 flex flex-col border-r border-gray-300">
        <div class="p-4 border-b border-gray-300 bg-gray-50">
          <h2 class="text-lg font-semibold">MDX Editor</h2>
        </div>
        <textarea
          class={`flex-1 p-4 border-0 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.editorClassName || ""}`}
          placeholder="Type your MDX content here..."
          value={mdxContent()}
          onInput={(e) => setMdxContent(e.currentTarget.value)}
          ref={(el) => el && (el.value = mdxContent())}
          spellcheck={false}
        />
      </div>

      {/* Preview Panel */}
      <div class="w-1/2 flex flex-col">
        <div class="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Preview</h2>
          <Show when={isLoading()}>
            <div class="text-sm text-gray-500">Compiling...</div>
          </Show>
        </div>
        
        <div class={`flex-1 p-4 overflow-auto ${props.previewClassName || ""}`}>
          <Show when={error()}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>MDX Error:</strong>
              <pre class="mt-2 text-sm whitespace-pre-wrap">{error()}</pre>
            </div>
          </Show>

          <Show when={previewContent() && !error()}>
            <div class="prose dark:prose-invert max-w-none">
              {previewContent()()}
            </div>
          </Show>

          <Show when={!previewContent() && !error() && !isLoading()}>
            <div class="text-gray-500 italic">
              Start typing in the editor to see the preview...
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}