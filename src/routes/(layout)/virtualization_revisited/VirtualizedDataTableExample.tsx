import { createSignal, Component } from 'solid-js'
import { ColumnDef } from '@tanstack/solid-table'
import VirtualizedDataTable from './VirtualizedDataTable'
import { makeData, Person } from './makeData'
import { tableStyles } from './tableStyles'

const VirtualizedDataTableExample: Component = () => {
  const [data] = createSignal(makeData(1000))
  const styles = tableStyles()

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => info.getValue(),
      size: 80,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: info => info.getValue(),
      size: 150,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: info => info.getValue(),
      size: 150,
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info => info.getValue(),
      size: 80,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'visits',
      header: 'Visits',
      cell: info => info.getValue(),
      size: 100,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as Person['status']
        return (
          <span class={styles.statusBadge({ status })}>
            {status}
          </span>
        )
      },
      size: 120,
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
      size: 200,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: info => {
        const date = info.getValue() as Date
        return date.toLocaleDateString()
      },
      size: 120,
    },
  ]

  return (
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Virtualized Data Table - 1000 Entries
      </h1>
      <VirtualizedDataTable
        data={data()}
        columns={columns}
        enableGlobalFilter={true}
        enableColumnFilters={true}
        enableSorting={true}
        searchPlaceholder="Search 1000 people..."
        height="600px"
        estimateSize={() => 52}
        overscan={10}
      />
    </div>
  )
}

export default VirtualizedDataTableExample