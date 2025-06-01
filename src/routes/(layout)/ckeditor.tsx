import { createSignal, onMount, Show } from "solid-js";
// import "../../../node_modules/ckeditor5/dist/ckeditor5.css";
import "ckeditor5/ckeditor5.css";


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
  return (
    <Card title="Markdown Preview" class="h-96 overflow-auto">
      <div class="prose prose-sm dark:prose-invert max-w-none">
        <div innerHTML={props.content}></div>
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

  onMount(async () => {
    setIsMounted(true);
    const {
      ClassicEditor,
      Essentials,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Font,
      Paragraph,
      Heading,
      Link,
      List,
      TodoList,
      Table,
      TableToolbar,
      Image,
      ImageToolbar,
      ImageUpload,
      ImageResize,
      ImageCaption,
      ImageStyle,
      Code,
      CodeBlock,
      BlockQuote,
      HorizontalLine,
      Indent,
      IndentBlock,
      Alignment,
      Highlight,
      RemoveFormat,
      FindAndReplace,
      SelectAll,
      Autoformat,
      TextTransformation,
      WordCount,
      SourceEditing,
      Markdown,
      MediaEmbed,
      PasteFromOffice,
      SpecialCharacters,
      SpecialCharactersEssentials,
    } = await import("ckeditor5");

    const editor = await ClassicEditor.create(editorRef, {
      licenseKey: "GPL",
      plugins: [
        Essentials,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Font,
        Paragraph,
        Heading,
        Link,
        List,
        TodoList,
        Table,
        TableToolbar,
        Image,
        ImageToolbar,
        ImageUpload,
        ImageResize,
        ImageCaption,
        ImageStyle,
        Code,
        CodeBlock,
        BlockQuote,
        HorizontalLine,
        Indent,
        IndentBlock,
        Alignment,
        Highlight,
        RemoveFormat,
        FindAndReplace,
        SelectAll,
        Autoformat,
        TextTransformation,
        WordCount,
        SourceEditing,
        Markdown,
        MediaEmbed,
        PasteFromOffice,
        SpecialCharacters,
        SpecialCharactersEssentials,
      ],
      toolbar: {
        items: [
          "sourceEditing",
          "|",
          "findAndReplace",
          "selectAll",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "removeFormat",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "highlight",
          "|",
          "alignment",
          "|",
          "numberedList",
          "bulletedList",
          "todoList",
          "|",
          "outdent",
          "indent",
          "|",
          "link",
          "insertImage",
          "mediaEmbed",
          "insertTable",
          "specialCharacters",
          "horizontalLine",
          "blockQuote",
          "codeBlock",
          "|",
          "undo",
          "redo",
        ],
        shouldNotGroupWhenFull: true,
      },
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5",
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6",
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      fontSize: {
        options: [
          9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
        ],
      },
      fontFamily: {
        options: [
          "default",
          "Arial, Helvetica, sans-serif",
          "Courier New, Courier, monospace",
          "Georgia, serif",
          "Lucida Sans Unicode, Lucida Grande, sans-serif",
          "Tahoma, Geneva, sans-serif",
          "Times New Roman, Times, serif",
          "Trebuchet MS, Helvetica, sans-serif",
          "Verdana, Geneva, sans-serif",
        ],
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      image: {
        toolbar: [
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageResize",
        ],
      },
      codeBlock: {
        languages: [
          { language: "plaintext", label: "Plain text" },
          { language: "c", label: "C" },
          { language: "cs", label: "C#" },
          { language: "cpp", label: "C++" },
          { language: "css", label: "CSS" },
          { language: "diff", label: "Diff" },
          { language: "html", label: "HTML" },
          { language: "java", label: "Java" },
          { language: "javascript", label: "JavaScript" },
          { language: "php", label: "PHP" },
          { language: "python", label: "Python" },
          { language: "ruby", label: "Ruby" },
          { language: "typescript", label: "TypeScript" },
          { language: "xml", label: "XML" },
        ],
      },
      link: {
        addTargetToExternalLinks: true,
      },
    });

    editor.model.document.on("change:data", () => {
      const htmlContent = editor.getData();
      setContent(htmlContent);

      try {
        const markdownOutput = editor.plugins
          .get("Markdown")
          .dataProcessor.toData(htmlContent);
        setMarkdownContent(markdownOutput);
      } catch (error) {
        console.warn("Markdown conversion failed:", error);
        setMarkdownContent(htmlContent);
      }
    });

    editor.setData(
      "<h1>Welcome to the Markdown Editor</h1><p>Start writing your content here. This editor supports <strong>bold</strong>, <em>italic</em>, <code>inline code</code>, and much more!</p><blockquote><p>Use the toolbar above to access all formatting options.</p></blockquote>",
    );
  });

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Advanced Markdown Editor (Only supports light mode)
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
                <div ref={editorRef} class="prose max-w-none"></div>
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
