import { createResource, Suspense } from "solid-js";

async function getContent() {
  "use server";

  try {
    const { readFileSync } = await import("fs");
    const path = await import("path");
    const filePath = path.join(
      process.cwd(),
      "src/routes/layout_examples/content.md",
    );
    const content = readFileSync(filePath, "utf8");
    return content;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "File not found: content.md";
    }
    throw error;
  }
}

async function getContentAsHTML() {
  "use server";

  try {
    // Get the markdown content
    const markdownContent = await getContent();
    // Dynamically import the marked library to parse markdown to HTML
    const { marked } = await import("marked");
    // Convert the markdown content to HTML and return it
    return marked(markdownContent);
  } catch (error) {
    throw error;
  }
}

export default function OverviewPage() {
  // Create a resource that handles an async function, combining the server-side function and the client-side
  // md conversion
  const [contentHTML] = createResource(getContentAsHTML);

  return (
    <div>
      {/* Suspense boundary handles the loading state while the resource is fetching */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Render the processed HTML content directly into the DOM */}
        <div
          class="p-4 prose dark:prose-invert"
          innerHTML={contentHTML()}
        ></div>
      </Suspense>
    </div>
  );
}
