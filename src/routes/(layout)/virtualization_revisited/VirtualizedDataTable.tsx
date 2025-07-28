import { createSignal, createMemo, For, Component } from 'solid-js'
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/solid-table'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { ChevronUp, ChevronDown } from 'lucide-solid'
import { tableStyles } from './tableStyles'

interface VirtualizedDataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  enableGlobalFilter?: boolean
  enableColumnFilters?: boolean
  enableSorting?: boolean
  searchPlaceholder?: string
  height?: string
  estimateSize?: () => number
  overscan?: number
}

function VirtualizedDataTable<T>(props: VirtualizedDataTableProps<T>): Component {
  let parentRef: HTMLDivElement | undefined
  
  const [sorting, setSorting] = createSignal<SortingState>([])
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = createSignal('')

  const table = createMemo(() =>
    createSolidTable({
      get data() {
        return props.data
      },
      get columns() {
        return props.columns
      },
      state: {
        get sorting() {
          return props.enableSorting !== false ? sorting() : []
        },
        get columnFilters() {
          return props.enableColumnFilters !== false ? columnFilters() : []
        },
        get globalFilter() {
          return props.enableGlobalFilter !== false ? globalFilter() : ''
        },
      },
      onSortingChange: props.enableSorting !== false ? setSorting : () => {},
      onColumnFiltersChange: props.enableColumnFilters !== false ? setColumnFilters : () => {},
      onGlobalFilterChange: props.enableGlobalFilter !== false ? setGlobalFilter : () => {},
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: props.enableSorting !== false ? getSortedRowModel() : getCoreRowModel(),
      getFilteredRowModel: (props.enableGlobalFilter !== false || props.enableColumnFilters !== false) ? getFilteredRowModel() : getCoreRowModel(),
    })
  )

  const filteredRows = createMemo(() => table().getRowModel().rows)

  const rowVirtualizer = createMemo(() => 
    createVirtualizer({
      get count() {
        return filteredRows().length
      },
      getScrollElement: () => parentRef!,
      estimateSize: props.estimateSize || (() => 48),
      overscan: props.overscan || 5,
    })
  )

  const styles = tableStyles()

  return (
    <div class={styles.container()}>
      {props.enableGlobalFilter !== false && (
        <div class={styles.searchContainer()}>
          <input
            value={globalFilter()}
            onInput={(e) => setGlobalFilter(e.currentTarget.value)}
            class={styles.searchInput()}
            placeholder={props.searchPlaceholder || "Search all columns..."}
          />
        </div>
      )}
      
      <div class={styles.tableWrapper()}>
        {/* Fixed Header Table */}
        <table class={`${styles.table()} table-fixed`}>
          <thead class={`${styles.thead()} sticky top-0 z-10`}>
            <For each={table().getHeaderGroups()}>
              {headerGroup => (
                <tr class={styles.headerRow()}>
                  <For each={headerGroup.headers}>
                    {header => (
                      <th 
                        class={styles.headerCell()}
                        style={{ 
                          width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto'
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            <button
                              class={styles.sortButton()}
                              onClick={header.column.getToggleSortingHandler()}
                              disabled={!header.column.getCanSort() || props.enableSorting === false}
                            >
                              <span class="font-semibold">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {props.enableSorting !== false && header.column.getIsSorted() === 'asc' && (
                                <ChevronUp size={16} />
                              )}
                              {props.enableSorting !== false && header.column.getIsSorted() === 'desc' && (
                                <ChevronDown size={16} />
                              )}
                            </button>
                            {props.enableColumnFilters !== false && header.column.getCanFilter() && (
                              <input
                                type="text"
                                value={header.column.getFilterValue() as string || ''}
                                onInput={(e) => header.column.setFilterValue(e.currentTarget.value)}
                                placeholder="Filter..."
                                class={styles.filterInput()}
                              />
                            )}
                          </div>
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
        </table>

        {/* Virtualized Body */}
        <div
          ref={parentRef}
          class="overflow-auto"
          style={{ height: props.height || "400px" }}
        >
          <div
            style={{
              height: `${rowVirtualizer().getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <For each={rowVirtualizer().getVirtualItems()}>
              {virtualItem => {
                const row = filteredRows()[virtualItem.index]
                if (!row) return null
                
                return (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <table class={`${styles.table()} table-fixed`}>
                      <tbody class={styles.tbody()}>
                        <tr class={styles.bodyRow()}>
                          <For each={row.getVisibleCells()}>
                            {cell => (
                              <td 
                                class={styles.bodyCell()}
                                style={{ 
                                  width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'auto'
                                }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            )}
                          </For>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              }}
            </For>
          </div>
        </div>
      </div>
      
      <div class={styles.footer()}>
        Showing {filteredRows().length} of {props.data.length} rows
      </div>
    </div>
  )
}

export default VirtualizedDataTable