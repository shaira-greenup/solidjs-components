export default function LayoutPage() {
  return (
    <>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Layout with Resizable Sidebar
      </h1>

      <div class="prose dark:prose-invert max-w-none">
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
          This layout demonstrates the corvu Resizer component with a sidebar
          and main content area. You can resize the sidebar by dragging the
          handle between the panels.
        </p>

        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Features
        </h2>

        <ul class="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            • Resizable sidebar with minimum and maximum width constraints
          </li>
          <li>• Smooth hover animations on the resize handle</li>
          <li>• Dark mode support</li>
          <li>• Responsive design</li>
          <li>• Keyboard accessible</li>
        </ul>

        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Sample Content
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Card 1
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Card 2
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
            Try It Out
          </h3>
          <p class="text-blue-700 dark:text-blue-300">
            Drag the vertical line between the sidebar and this content area to
            resize the panels. The sidebar has minimum and maximum width
            constraints to ensure a good user experience.
          </p>
        </div>
      </div>
    </>
  );
}
