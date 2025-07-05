import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  Table,
} from "@tanstack/solid-table";
import { createSignal, For, onMount, onCleanup, JSX } from "solid-js";
import { isServer } from "solid-js/web";

export interface DataTableConfig<T> {
  data: () => T[];
  columns: ColumnDef<T>[];
  title?: string;
  description?: string;
  headerContent?: JSX.Element;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableKeyboardNavigation?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onRerender?: () => void;
  className?: string;
}

interface KeyboardShortcut {
  key: string;
  description: string;
}

/**
 * Keyboard shortcuts documentation component
 */
function KeyboardShortcutsHeader(props: { shortcuts: KeyboardShortcut[] }) {
  return (
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
      <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Keyboard Shortcuts
      </h3>
      <div class="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div class="space-y-1">
          <For
            each={props.shortcuts.slice(
              0,
              Math.ceil(props.shortcuts.length / 2),
            )}
          >
            {(shortcut) => (
              <div>
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  {shortcut.key}
                </kbd>{" "}
                {shortcut.description}
              </div>
            )}
          </For>
        </div>
        <div class="space-y-1">
          <For
            each={props.shortcuts.slice(Math.ceil(props.shortcuts.length / 2))}
          >
            {(shortcut) => (
              <div>
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  {shortcut.key}
                </kbd>{" "}
                {shortcut.description}
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

/**
 * Table header component
 */
function DataTableHeader<T>(props: {
  title?: string;
  description?: string;
  headerContent?: JSX.Element;
  enableKeyboardNavigation?: boolean;
}) {
  const keyboardShortcuts: KeyboardShortcut[] = [
    { key: "Alt+←", description: "Previous page" },
    { key: "Alt+→", description: "Next page" },
    { key: "Home", description: "First page" },
    { key: "End", description: "Last page" },
    { key: "1-5", description: "Set page size (10-50)" },
    { key: "G", description: "Go to page (prompt)" },
    { key: "R", description: "Rerender data" },
  ];

  return (
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      {props.title && (
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {props.title}
        </h2>
      )}

      {props.description && (
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {props.description}
        </p>
      )}

      {props.headerContent}

      {props.enableKeyboardNavigation && (
        <KeyboardShortcutsHeader shortcuts={keyboardShortcuts} />
      )}
    </div>
  );
}

/**
 * Sortable column header with visual sorting indicators
 */
function SortableColumnHeader<T>(props: { header: any }) {
  const { header } = props;

  return (
    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      {header.isPlaceholder ? null : (
        <div
          classList={{
            "flex items-center space-x-1": true,
            "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100":
              header.column.getCanSort(),
          }}
          onClick={header.column.getToggleSortingHandler()}
        >
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {header.column.getCanSort() && (
            <span class="text-gray-400">
              {{
                asc: "↑",
                desc: "↓",
              }[header.column.getIsSorted() as string] ?? "↕"}
            </span>
          )}
        </div>
      )}
    </th>
  );
}

/**
 * Table header section with sortable columns
 */
function TableHeader<T>(props: { table: Table<T> }) {
  return (
    <thead class="bg-gray-50 dark:bg-gray-700">
      <For each={props.table.getHeaderGroups()}>
        {(headerGroup) => (
          <tr>
            <For each={headerGroup.headers}>
              {(header) => <SortableColumnHeader header={header} />}
            </For>
          </tr>
        )}
      </For>
    </thead>
  );
}

/**
 * Table body with data rows
 */
function TableBody<T>(props: { table: Table<T> }) {
  return (
    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      <For each={props.table.getRowModel().rows}>
        {(row) => (
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <For each={row.getVisibleCells()}>
              {(cell) => (
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )}
            </For>
          </tr>
        )}
      </For>
    </tbody>
  );
}

/**
 * Table footer with column information
 */
function TableFooter<T>(props: { table: Table<T> }) {
  return (
    <tfoot class="bg-gray-50 dark:bg-gray-700">
      <For each={props.table.getFooterGroups()}>
        {(footerGroup) => (
          <tr>
            <For each={footerGroup.headers}>
              {(header) => (
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </th>
              )}
            </For>
          </tr>
        )}
      </For>
    </tfoot>
  );
}

/**
 * Pagination controls component with keyboard navigation
 */
function PaginationControls<T>(props: {
  table: Table<T>;
  onRerender?: () => void;
  enableKeyboardNavigation?: boolean;
  pageSizeOptions?: number[];
}) {
  const { table } = props;
  const pageSizeOptions = props.pageSizeOptions || [10, 20, 30, 40, 50];

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!props.enableKeyboardNavigation) return;

    // Prevent default behavior for navigation keys
    const navigationKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (
      navigationKeys.includes(event.key) ||
      (event.key >= "1" && event.key <= "5") ||
      event.key.toLowerCase() === "g" ||
      event.key.toLowerCase() === "r"
    ) {
      event.preventDefault();
    }

    switch (event.key) {
      case "ArrowLeft":
        if (event.altKey && table.getCanPreviousPage()) {
          table.previousPage();
        }
        break;
      case "ArrowRight":
        if (event.altKey && table.getCanNextPage()) {
          table.nextPage();
        }
        break;
      case "Home":
        if (table.getCanPreviousPage()) {
          table.setPageIndex(0);
        }
        break;
      case "End":
        if (table.getCanNextPage()) {
          table.setPageIndex(table.getPageCount() - 1);
        }
        break;
      case "1":
        table.setPageSize(pageSizeOptions[0] || 10);
        break;
      case "2":
        table.setPageSize(pageSizeOptions[1] || 20);
        break;
      case "3":
        table.setPageSize(pageSizeOptions[2] || 30);
        break;
      case "4":
        table.setPageSize(pageSizeOptions[3] || 40);
        break;
      case "5":
        table.setPageSize(pageSizeOptions[4] || 50);
        break;
      case "g":
      case "G":
        const pageInput = prompt(
          `Go to page (1-${table.getPageCount()}):`,
          String(table.getState().pagination.pageIndex + 1),
        );
        if (pageInput) {
          const pageNumber = parseInt(pageInput, 10);
          if (pageNumber >= 1 && pageNumber <= table.getPageCount()) {
            table.setPageIndex(pageNumber - 1);
          }
        }
        break;
      case "r":
      case "R":
        if (props.onRerender) {
          props.onRerender();
        }
        break;
    }
  };

  onMount(() => {
    if (!isServer && props.enableKeyboardNavigation) {
      document.addEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    if (
      !isServer &&
      typeof document !== "undefined" &&
      props.enableKeyboardNavigation
    ) {
      document.removeEventListener("keydown", handleKeyDown);
    }
  });

  return (
    <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} ({table.getFilteredRowModel().rows.length}{" "}
          total rows)
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="First page (Home)"
        >
          {"<<"}
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Previous page (Alt+←)"
        >
          {"<"}
        </button>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Next page (Alt+→)"
        >
          {">"}
        </button>

        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Last page (End)"
        >
          {">>"}
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          title="Page size (1-5 keys)"
        >
          <For each={pageSizeOptions}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>

        <button
          onClick={() => {
            const pageInput = prompt(
              `Go to page (1-${table.getPageCount()}):`,
              String(table.getState().pagination.pageIndex + 1),
            );
            if (pageInput) {
              const pageNumber = parseInt(pageInput, 10);
              if (pageNumber >= 1 && pageNumber <= table.getPageCount()) {
                table.setPageIndex(pageNumber - 1);
              }
            }
          }}
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Go to page (G)"
        >
          Go to...
        </button>
      </div>
    </div>
  );
}

/**
 * Reusable DataTable component with sorting, pagination, and keyboard navigation
 */
export default function DataTable<T>(props: DataTableConfig<T>) {
  const {
    data,
    columns,
    title,
    description,
    headerContent,
    enableSorting = true,
    enablePagination = true,
    enableKeyboardNavigation = true,
    initialPageSize = 20,
    pageSizeOptions = [10, 20, 30, 40, 50],
    onRerender,
    className = "",
  } = props;

  const tableConfig: any = {
    get data() {
      return data();
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  };

  if (enableSorting) {
    tableConfig.getSortedRowModel = getSortedRowModel();
  }

  if (enablePagination) {
    tableConfig.getPaginationRowModel = getPaginationRowModel();
    tableConfig.initialState = {
      pagination: {
        pageSize: initialPageSize,
      },
    };
  }

  const table = createSolidTable(tableConfig);

  return (
    <div
      class={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <DataTableHeader
        title={title}
        description={description}
        headerContent={headerContent}
        enableKeyboardNavigation={enableKeyboardNavigation}
      />

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader table={table} />
          <TableBody table={table} />
          <TableFooter table={table} />
        </table>
      </div>

      {enablePagination && (
        <PaginationControls
          table={table}
          onRerender={onRerender}
          enableKeyboardNavigation={enableKeyboardNavigation}
          pageSizeOptions={pageSizeOptions}
        />
      )}

      {onRerender && (
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onRerender}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            title="Rerender data (R)"
          >
            Rerender
          </button>
        </div>
      )}
    </div>
  );
}
