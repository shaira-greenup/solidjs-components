import { createSignal, createMemo, For } from 'solid-js'
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
import { tv } from 'tailwind-variants'
import ChevronUp from 'lucide-solid/icons/chevron-up';
import ChevronDown from 'lucide-solid/icons/chevron-down';

import { makeData, Person } from './makeData'

const tableStyles = tv({
  slots: {
    container: 'p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
    searchContainer: 'mb-6',
    searchInput: 'w-full max-w-sm px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
    tableWrapper: 'overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
    table: 'w-full divide-y divide-gray-200 dark:divide-gray-700',
    thead: 'bg-gray-50 dark:bg-gray-800',
    headerRow: 'divide-x divide-gray-200 dark:divide-gray-700',
    headerCell: 'px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    sortButton: 'flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer',
    filterInput: 'mt-2 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full max-w-[120px]',
    tbody: 'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700',
    bodyRow: 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
    bodyCell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
    footer: 'mt-4 text-sm text-gray-600 dark:text-gray-400',
    statusBadge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  },
  variants: {
    status: {
      single: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      relationship: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      complicated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    }
  }
})

const DataTable = () => {
  const [data] = createSignal(makeData(50))
  const [sorting, setSorting] = createSignal<SortingState>([])
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = createSignal('')

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'visits',
      header: 'Visits',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as Person['status']
        const styles = tableStyles()
        return (
          <span class={styles.statusBadge({ status })}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: info => {
        const progress = info.getValue() as number
        return (
          <div class="flex items-center">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">{progress}%</span>
          </div>
        )
      },
    },
  ]

  const table = createMemo(() =>
    createSolidTable({
      get data() {
        return data()
      },
      columns,
      state: {
        get sorting() {
          return sorting()
        },
        get columnFilters() {
          return columnFilters()
        },
        get globalFilter() {
          return globalFilter()
        },
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
  )

  const styles = tableStyles()

  return (
    <div class={styles.container()}>
      <div class={styles.searchContainer()}>
        <input
          value={globalFilter()}
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          class={styles.searchInput()}
          placeholder="Search all columns..."
        />
      </div>
      
      <div class={styles.tableWrapper()}>
        <table class={styles.table()}>
          <thead class={styles.thead()}>
            <For each={table().getHeaderGroups()}>
              {headerGroup => (
                <tr class={styles.headerRow()}>
                  <For each={headerGroup.headers}>
                    {header => (
                      <th class={styles.headerCell()}>
                        {header.isPlaceholder ? null : (
                          <div>
                            <button
                              class={styles.sortButton()}
                              onClick={header.column.getToggleSortingHandler()}
                              disabled={!header.column.getCanSort()}
                            >
                              <span class="font-semibold">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {header.column.getIsSorted() === 'asc' && (
                                <ChevronUp size={16} />
                              )}
                              {header.column.getIsSorted() === 'desc' && (
                                <ChevronDown size={16} />
                              )}
                            </button>
                            {header.column.getCanFilter() && (
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
          <tbody class={styles.tbody()}>
            <For each={table().getRowModel().rows}>
              {row => (
                <tr class={styles.bodyRow()}>
                  <For each={row.getVisibleCells()}>
                    {cell => (
                      <td class={styles.bodyCell()}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      
      <div class={styles.footer()}>
        Showing {table().getRowModel().rows.length} of {data().length} rows
      </div>
    </div>
  )
}

export default DataTable
