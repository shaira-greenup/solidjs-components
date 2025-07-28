import { createSignal, Component } from 'solid-js'
import { ColumnDef } from '@tanstack/solid-table'
import VirtualizedDataTable from './VirtualizedDataTable'
import { tableStyles } from './tableStyles'

interface Employee {
  id: number
  name: string
  email: string
  department: string
  salary: number
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended'
  joinDate: Date
  performance: number
}

const generateEmployeeData = (count: number): Employee[] => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations']
  const statuses: Employee['status'][] = ['Active', 'Inactive', 'Pending', 'Suspended']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: departments[i % departments.length],
    salary: Math.floor(Math.random() * 100000) + 40000,
    status: statuses[i % statuses.length],
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    performance: Math.floor(Math.random() * 100),
  }))
}

const VirtualizedEmployeeTable: Component = () => {
  const [data] = createSignal(generateEmployeeData(1000))
  const styles = tableStyles()

  const columns: ColumnDef<Employee>[] = [
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
      accessorKey: 'name',
      header: 'Name',
      cell: info => info.getValue(),
      size: 180,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: info => (
        <a 
          href={`mailto:${info.getValue()}`}
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {info.getValue() as string}
        </a>
      ),
      size: 250,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: info => (
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {info.getValue() as string}
        </span>
      ),
      size: 130,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: info => {
        const salary = info.getValue() as number
        return `$${salary.toLocaleString()}`
      },
      size: 120,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as Employee['status']
        return (
          <span class={styles.statusBadge({ status })}>
            {status}
          </span>
        )
      },
      size: 120,
    },
    {
      accessorKey: 'performance',
      header: 'Performance',
      cell: info => {
        const performance = info.getValue() as number
        const getPerformanceColor = (score: number) => {
          if (score >= 80) return 'bg-green-500'
          if (score >= 60) return 'bg-yellow-500'
          return 'bg-red-500'
        }
        
        return (
          <div class="flex items-center gap-2">
            <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class={`h-2 rounded-full transition-all ${getPerformanceColor(performance)}`}
                style={{ width: `${performance}%` }}
              ></div>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400 w-8">{performance}%</span>
          </div>
        )
      },
      size: 150,
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        return value.toString().includes(filterValue)
      },
    },
    {
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: info => {
        const date = info.getValue() as Date
        return date.toLocaleDateString()
      },
      size: 120,
    },
  ]

  return (
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Employee Directory
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Virtualized table showing 1,000 employee records with full filtering and sorting
        </p>
      </div>
      
      <VirtualizedDataTable
        data={data()}
        columns={columns}
        enableGlobalFilter={true}
        enableColumnFilters={true}
        enableSorting={true}
        searchPlaceholder="Search employees..."
        height="650px"
        estimateSize={() => 56}
        overscan={15}
      />
    </div>
  )
}

export default VirtualizedEmployeeTable