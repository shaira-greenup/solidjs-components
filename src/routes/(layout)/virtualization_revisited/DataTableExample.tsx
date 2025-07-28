import { createSignal, Component } from "solid-js";
import { ColumnDef } from "@tanstack/solid-table";
import DataTable from "./GenericDataTable";
import { makeData, Person } from "./makeData";
import { tableStyles } from "./tableStyles";

const DataTableExample: Component = () => {
  const [data] = createSignal(makeData(50));
  const styles = tableStyles();

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number;
        return value.toString().includes(filterValue);
      },
    },
    {
      accessorKey: "visits",
      header: "Visits",
      cell: (info) => info.getValue(),
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number;
        return value.toString().includes(filterValue);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as Person["status"];
        return <span class={styles.statusBadge({ status })}>{status}</span>;
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: (info) => {
        const progress = info.getValue() as number;
        return (
          <div class="flex items-center">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {progress}%
            </span>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number;
        return value.toString().includes(filterValue);
      },
    },
  ];

  return (
    <DataTable
      data={data()}
      columns={columns}
      enableGlobalFilter={true}
      enableColumnFilters={true}
      enableSorting={true}
      searchPlaceholder="Search people..."
    />
  );
};

export default DataTableExample;
