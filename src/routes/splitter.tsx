
import Resizable from "@corvu/resizable";

function SkeletonBar({ width }: { width?: string }) {
  return (
    <div
      class={`h-4 dark:bg-gray-600 bg-gray-400 rounded animate-pulse ${width || ""}`}
    ></div>
  );
}

function SkeletonOne() {
  return (
    <div class="space-y-3">
      <SkeletonBar />
      <SkeletonBar width="w-3/4" />
      <SkeletonBar width="w-1/2" />
    </div>
  );
}

function SkeletonTwo() {
  return (
    <div class="space-y-3">
      <div class="h-6 dark:bg-gray-600 bg-gray-400 rounded animate-pulse"></div>
      <SkeletonBar />
      <SkeletonBar width="w-5/6" />
      <SkeletonBar width="w-2/3" />
    </div>
  );
}

function SkeletonTitle() {
  return (
    <div class="h-8 dark:bg-gray-600 bg-gray-400 rounded animate-pulse w-1/3"></div>
  );
}

function SkeletonCardGrid() {
  return (
    <div class="grid grid-cols-3 gap-3">
      <div class="h-20 dark:bg-gray-600 bg-gray-400 rounded animate-pulse"></div>
      <div class="h-20 dark:bg-gray-600 bg-gray-400 rounded animate-pulse"></div>
      <div class="h-20 dark:bg-gray-600 bg-gray-400 rounded animate-pulse"></div>
    </div>
  );
}

function SkeletonThree() {
  return (
    <div class="space-y-3">
      <SkeletonTitle />
      <SkeletonCardGrid />
      <SkeletonBar />
      <SkeletonBar width="w-4/5" />
    </div>
  );
}

export default function Home() {
  /*
 |------------------|-------------------------|
 |                  |  Top Right Panel        |
 |   Left Panel     |-------------------------|
 |                  |  Bottom Right Panel     |
 |------------------|-------------------------|

  */

  return (
    <div class="size-full bg-gray-50 dark:bg-gray-900">
      <Resizable class="size-full">
        {/* Left Panel  */}
        <Resizable.Panel
          initialSize={0.3}
          minSize={0.2}
          class="bg-white dark:bg-gray-800 p-6 shadow-sm border-r border-gray-200 dark:border-gray-700"
        >
          <SkeletonOne />
        </Resizable.Panel>
        <Resizable.Handle
          aria-label="Resize Handle"
          class="group basis-1 hover:basis-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-col-resize"
        >
          <div class="size-full relative before:absolute before:inset-0 before:-inset-x-2 before:content-['']" />
        </Resizable.Handle>

        {/* Top Right Panel */}
        <Resizable.Panel initialSize={0.7} minSize={0.2}>
          <Resizable orientation="vertical" class="size-full">
            <Resizable.Panel
              initialSize={0.5}
              class="bg-white dark:bg-gray-800 p-6 shadow-sm border-b border-gray-200 dark:border-gray-700"
            >
              <SkeletonTwo />
            </Resizable.Panel>
            <Resizable.Handle
              aria-label="Resize Handle"
              class="group basis-1 hover:basis-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-row-resize"
            >
              <div class="size-full relative before:absolute before:inset-0 before:-inset-y-2 before:content-['']" />
            </Resizable.Handle>
            {/* Bottom Rigth Panel */}
            <Resizable.Panel initialSize={0.5} minSize={0.2}>
              <Resizable class="size-full">
                <Resizable.Panel
                  initialSize={1.0}
                  class="bg-white dark:bg-gray-800 p-6 shadow-sm"
                >
                  <SkeletonThree />
                </Resizable.Panel>
              </Resizable>
            </Resizable.Panel>
          </Resizable>
        </Resizable.Panel>
      </Resizable>
    </div>
  );
}
