import { tv } from 'tailwind-variants'

export const tableStyles = tv({
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
      Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
  }
})

export const virtualTableStyles = tv({
  slots: {
    container: 'w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm',
    header: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
    headerRow: 'flex',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 last:border-r-0',
    scrollContainer: 'overflow-auto',
    virtualContainer: 'relative w-full',
    bodyRow: 'flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors absolute top-0 left-0 w-full',
    bodyCell: 'px-6 py-4 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-800 last:border-r-0 flex items-center',
    statusBadge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  },
  variants: {
    status: {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
  }
})
