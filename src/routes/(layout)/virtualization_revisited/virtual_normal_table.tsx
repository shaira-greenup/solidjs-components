import { createVirtualizer } from "@tanstack/solid-virtual";
import { JSX } from "solid-js";
import { virtualTableStyles } from "./tableStyles";
import Card from "~/components/Card";

interface TableColumn {
  header: string;
  accessor: string;
  width?: string;
  type?: "status" | "default";
}

interface VirtualTableProps {
  columns: TableColumn[];
  data: any[];
  height?: string;
  estimateSize?: () => number;
  overscan?: number;
}

function VirtualTable(props: VirtualTableProps) {
  let parentRef: HTMLDivElement | undefined;
  const styles = virtualTableStyles();

  const rowVirtualizer = createVirtualizer({
    count: props.data.length,
    getScrollElement: () => parentRef!,
    estimateSize: props.estimateSize || (() => 48),
    overscan: props.overscan || 5,
  });

  const renderCellContent = (item: any, column: TableColumn) => {
    const value = item[column.accessor];

    if (column.type === "status" && typeof value === "string") {
      return (
        <span class={styles.statusBadge({ status: value as any })}>
          {value}
        </span>
      );
    }

    return value;
  };

  return (
    <div class={styles.container()}>
      {/* Table Header */}
      <div class={styles.header()}>
        <div class={styles.headerRow()}>
          {props.columns.map((column) => (
            <div
              class={styles.headerCell()}
              style={{ width: column.width || "auto", "flex-shrink": 0 }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Body */}
      <div
        ref={parentRef}
        class={styles.scrollContainer()}
        style={{ height: props.height || "600px" }}
      >
        <div
          class={styles.virtualContainer()}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const item = props.data[virtualItem.index];
            return (
              <div
                class={styles.bodyRow()}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {props.columns.map((column) => (
                  <div
                    class={styles.bodyCell()}
                    style={{ width: column.width || "auto", "flex-shrink": 0 }}
                  >
                    {renderCellContent(item, column)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sample data generator
function generateTableData(count: number) {
  const companies = [
    "Apple",
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Tesla",
    "Netflix",
    "Adobe",
    "Salesforce",
    "Oracle",
  ];
  const statuses = ["Active", "Inactive", "Pending", "Suspended"];
  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    company: companies[i % companies.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    salary: `$${(Math.random() * 100000 + 50000).toFixed(0)}`,
    joinDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString(),
  }));
}

function App() {
  const tableData = generateTableData(10000);

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", width: "80px" },
    { header: "Name", accessor: "name", width: "150px" },
    { header: "Email", accessor: "email", width: "200px" },
    { header: "Company", accessor: "company", width: "120px" },
    { header: "Department", accessor: "department", width: "120px" },
    { header: "Status", accessor: "status", width: "100px", type: "status" },
    { header: "Salary", accessor: "salary", width: "100px" },
    { header: "Join Date", accessor: "joinDate", width: "120px" },
  ];

  return (
      <VirtualTable columns={columns} data={tableData} height="700px" />
  );
}

export default App;
