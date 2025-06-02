import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/solid-table";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { createSignal, createEffect, onMount, onCleanup, For, JSX } from "solid-js";
import { isServer } from "solid-js/web";

export interface DataTableScrollConfig<T> {
  data: () => T[];
  columns: ColumnDef<T>[];
  title?: string;
  description?: string;
  headerContent?: JSX.Element;
  enableSorting?: boolean;
  onFetchMore?: () => void;
  isFetching?: () => boolean;
  hasMore?: () => boolean;
  totalCount?: () => number;
  className?: string;
  height?: string;
  estimatedRowHeight?: number;
}

/**
 * Table header component for virtualized table
 */
function VirtualTableHeader<T>(props: { 
  title?: string; 
  description?: string; 
  headerContent?: JSX.Element;
  totalFetched: () => number;
  totalCount: () => number;
}) {
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
      
      <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
        ({props.totalFetched()} of {props.totalCount()} rows loaded)
      </div>
    </div>
  );
}

/**
 * Sortable column header with visual sorting indicators for virtual table
 */
function VirtualSortableColumnHeader<T>(props: { header: any }) {
  const { header } = props;

  return (
    <th 
      style={{
        display: "flex",
        width: `${header.getSize()}px`,
        "align-items": "center",
        padding: "12px 24px",
        "background-color": "var(--color-base-200, #f8fafc)",
        "border-bottom": "1px solid var(--color-base-300, #e2e8f0)",
      }}
    >
      {header.isPlaceholder ? null : (
        <div
          classList={{
            "flex items-center space-x-1": true,
            "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-100":
              header.column.getCanSort(),
          }}
          onClick={header.column.getToggleSortingHandler()}
          style={{
            "font-size": "12px",
            "font-weight": "500",
            "text-transform": "uppercase",
            "letter-spacing": "0.05em",
            color: "var(--color-base-content, #374151)",
          }}
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
 * Reusable DataTableScroll component with virtualized infinite scrolling
 */
export default function DataTableScroll<T>(props: DataTableScrollConfig<T>) {
  const {
    data,
    columns,
    title,
    description,
    headerContent,
    enableSorting = true,
    onFetchMore,
    isFetching = () => false,
    hasMore = () => true,
    totalCount = () => data().length,
    className = "",
    height = "600px",
    estimatedRowHeight = 33,
  } = props;

  const [sorting, setSorting] = createSignal<SortingState>([]);
  let tableContainerRef: HTMLDivElement | undefined;

  const tableConfig: any = {
    get data() {
      return data();
    },
    columns,
    state: {
      get sorting() {
        return sorting();
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: false, // Let TanStack Table handle sorting automatically
  };

  if (enableSorting) {
    tableConfig.getSortedRowModel = getSortedRowModel();
  }

  const table = createSolidTable(tableConfig);

  // Create a reactive key that changes when sorting changes to force virtualizer updates
  const [virtualizerKey, setVirtualizerKey] = createSignal(0);

  // Create virtualizer - make it reactive to sorting changes
  const rowVirtualizer = createVirtualizer({
    get count() {
      // Access the key to make this reactive to sorting changes
      virtualizerKey();
      return table.getRowModel().rows.length;
    },
    getScrollElement: () => isServer ? null : tableContainerRef,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  // Fetch more data when scrolled near bottom
  const fetchMoreOnBottomReached = (containerElement?: HTMLDivElement | null) => {
    if (containerElement && onFetchMore && hasMore() && !isFetching()) {
      const { scrollHeight, scrollTop, clientHeight } = containerElement;
      // Fetch more when within 500px of bottom
      if (scrollHeight - scrollTop - clientHeight < 500) {
        onFetchMore();
      }
    }
  };

  // Handle scroll events
  const handleScroll = (e: Event) => {
    fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement);
  };

  // Handle sorting changes and force virtualizer update
  createEffect(() => {
    if (isServer) return;
    
    const currentSorting = sorting();
    const rows = table.getRowModel().rows;
    
    if (rows.length > 0) {
      // Force virtualizer to recreate by changing the key
      setVirtualizerKey(prev => prev + 1);
      
      // Use requestAnimationFrame to ensure virtualizer has updated before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(0, { align: 'start' });
        });
      });
    }
  });

  // Recreate virtualizer when key changes
  createEffect(() => {
    if (isServer) return;
    
    // Access virtualizerKey to make this reactive
    virtualizerKey();
    
    // Force virtualizer to measure all items again
    rowVirtualizer.measure();
  });

  // Check if we need to fetch more data on mount and after data changes (client-only)
  createEffect(() => {
    if (isServer || !tableContainerRef) return;
    
    fetchMoreOnBottomReached(tableContainerRef);
  });

  return (
    <div class={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <VirtualTableHeader
        title={title}
        description={description}
        headerContent={headerContent}
        totalFetched={() => data().length}
        totalCount={totalCount}
      />

      <div
        ref={tableContainerRef}
        onScroll={handleScroll}
        style={{
          overflow: "auto",
          position: "relative",
          height: height,
        }}
        class="border-t border-gray-200 dark:border-gray-700"
      >
        <table style={{ display: "grid" }}>
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: "0",
              "z-index": "1",
            }}
          >
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr style={{ display: "flex", width: "100%" }}>
                  <For each={headerGroup.headers}>
                    {(header) => <VirtualSortableColumnHeader header={header} />}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                return (
                  <tr
                    data-index={virtualRow.index}
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <td
                          style={{
                            display: "flex",
                            width: `${cell.column.getSize()}px`,
                            "align-items": "center",
                            padding: "12px 24px",
                            "border-bottom": "1px solid var(--color-base-300, #e2e8f0)",
                          }}
                          class="text-sm text-gray-900 dark:text-gray-100"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )}
                    </For>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>

      {isFetching() && (
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-center">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Loading more data...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
