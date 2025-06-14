export default function LayoutsOverview() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Layout System Overview
          </h1>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our Current approach to building maintainable layouts with Solid-JS
          </p>
        </div>

        {/* Workflow Section */}
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-8 flex items-center">
            <span class="bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mr-4">
              1
            </span>
            Development Workflow
          </h2>

          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <div class="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">
                  Create Initial Template
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span class="text-slate-600">
                      Semi-transparent styling for development visibility
                    </span>
                    <code class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                      bg-red-500/50 border border-red-600
                    </code>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span class="text-slate-600">
                      JavaScript-first approach for rapid prototyping
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">
                  Optimize for Production
                </h3>
                <p class="text-slate-600 mb-2">
                  Once satisfied with the layout, migrate to{" "}
                  <code class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                    peer-checked
                  </code>{" "}
                  pattern
                </p>
                <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p class="text-amber-800 text-sm">
                    <strong>Note:</strong> Only migrate to CSS-only solutions if
                    this isn't a JavaScript-heavy application, as it may reduce
                    code clarity
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">
                  Polish & Refine
                </h3>
                <p class="text-slate-600">
                  Create a production-ready template showcasing the final
                  implementation
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-2">
                  Package for Distribution
                </h3>
                <p class="text-slate-600">
                  Create a ready-to-use directory structure for easy template
                  deployment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Structure Section */}
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 class="text-3xl font-bold text-slate-900 mb-8 flex items-center">
            <span class="bg-purple-500 text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mr-4">
              2
            </span>
            Project Structure
          </h2>

          <div class="bg-slate-50 rounded-xl p-6 mb-6">
            <code class="text-slate-700 font-mono text-lg">
              layout_examples/&lt;Description&gt;
            </code>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {/* Overview Card */}
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
                  📋
                </div>
                <h3 class="text-xl font-bold text-blue-900">Overview</h3>
              </div>
              <ul class="space-y-3 text-blue-800">
                <li class="flex items-start space-x-2">
                  <span class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Repository links to production-ready templates</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Purpose and creation rationale</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Template goals and objectives</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Intended usage scenarios</span>
                </li>
              </ul>
            </div>

            {/* Sandbox Card */}
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="bg-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
                  🧪
                </div>
                <h3 class="text-xl font-bold text-orange-900">Sandbox</h3>
              </div>
              <p class="text-orange-800 mb-3">Development environment for:</p>
              <ul class="space-y-2 text-orange-700">
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  <span>Initial prototyping (Steps 1-2)</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  <span>Interactive testing</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  <span>Rapid iteration</span>
                </li>
              </ul>
            </div>

            {/* Polished Card */}
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="bg-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
                  ✨
                </div>
                <h3 class="text-xl font-bold text-emerald-900">Polished</h3>
              </div>
              <p class="text-emerald-800 mb-3">
                Production-ready implementation:
              </p>
              <ul class="space-y-2 text-emerald-700">
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  <span>Final template (Step 4)</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  <span>Optimized performance</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  <span>Ready for deployment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*

# Layouts Overview

## Workflow

1. Create a template with
    1. Semi-Opaque (e.g. `bg-red-500/50 border border-red-600`)
    2. JS Only
2. Once Happy with layout migrate to `peer-checked` (see note `0006371beb4341b4295286d204c768fc`)
    - Only migrate to `peer-checked` if this isn't a JS application, the code will be harder to follow
3. Create a polished template demonstrating how that can look
4. Create a ready to go Directory where that template can be pulled from

## This Structure

- `layout_examples/<Descr>`
    - Overview
        - Links to a Repo with a Template ready to go corresponding to step 4
        - Describes the:
            - Purpose for creating it
            - Goals of Template
            - Intended Usage
    - Sandbox
        - This corresponds to steps 1 and 2
    - Polished
        - This corresponds to Steps 4

*/
