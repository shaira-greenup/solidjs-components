import { RouteSectionProps } from "@solidjs/router";
import Layout from "~/components/Layout";
import NavTree from "~/components/NavTree";

function Sidebar() {
  return (
    <div class="h-full flex flex-col bg-[var(--color-base-200)] text-[var(--color-base-content)]">
      <NavTree />
    </div>
  );
}

export default function LayoutRoute(props: RouteSectionProps) {
  return (
    <div class="h-screen flex flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]">
      <Layout sidebar={<Sidebar />}>
        <div class="p-8 h-full overflow-auto bg-[var(--color-base-100)]">
          <div class="max-w-4xl mx-auto">
            {props.children}
          </div>
        </div>
      </Layout>
    </div>
  );
}
